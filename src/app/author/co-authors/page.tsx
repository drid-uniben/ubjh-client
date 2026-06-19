"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthorLayout } from "@/components/authors/AuthorLayout";
import { authorPortalApi, type AuthorDashboardManuscript, type CoAuthorRecord } from "@/services/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Pencil, CheckCircle, AlertCircle } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function ManageCoAuthorsPage() {
  const { isAuthenticated } = useAuth();
  const [manuscripts, setManuscripts] = useState<AuthorDashboardManuscript[]>([]);
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<string>("");
  const [coAuthors, setCoAuthors] = useState<CoAuthorRecord[]>([]);
  const [incompleteCoAuthors, setIncompleteCoAuthors] = useState<CoAuthorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CoAuthorRecord>({ _id: "" });
  const [saving, setSaving] = useState(false);

  const loadManuscripts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await authorPortalApi.getDashboard();
      setManuscripts(response.data.manuscripts);
      if (response.data.manuscripts.length > 0) {
        setSelectedManuscriptId(response.data.manuscripts[0]._id);
      }
    } catch (error) {
      console.error("Failed to load manuscripts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadCoAuthors = useCallback(async (manuscriptId: string) => {
    if (!manuscriptId) return;
    try {
      const response = await authorPortalApi.getCoAuthors(manuscriptId);
      setCoAuthors(response.data.coAuthors || []);
      setIncompleteCoAuthors(response.data.incompleteCoAuthors || []);
    } catch (error) {
      console.error("Failed to load co-authors:", error);
      toast.error("Failed to load co-authors for this manuscript");
    }
  }, []);

  useEffect(() => { loadManuscripts(); }, [loadManuscripts]);
  useEffect(() => { if (selectedManuscriptId) loadCoAuthors(selectedManuscriptId); }, [selectedManuscriptId, loadCoAuthors]);

  const startEdit = (coAuthor: CoAuthorRecord) => {
    setEditingId(coAuthor._id);
    setEditForm(coAuthor);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await authorPortalApi.updateCoAuthor(editForm._id, {
        name: editForm.name,
        email: editForm.email,
        faculty: editForm.faculty,
        affiliation: editForm.affiliation,
        orcid: editForm.orcid,
      });
      toast.success("Co-author information updated.");
      setEditingId(null);
      loadCoAuthors(selectedManuscriptId);
    } catch (error) {
      console.error("Failed to update co-author:", error);
      toast.error("Failed to update co-author");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AuthorLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-journal-maroon" />
        </div>
      </AuthorLayout>
    );
  }

  return (
    <AuthorLayout>
      <div className="space-y-6 p-5 max-w-3xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Manage Co-authors</h1>
          <p className="text-gray-600 mt-1">Complete missing information for your co-authors</p>
        </div>

        {manuscripts.length === 0 ? (
          <p className="text-gray-500">You have no manuscripts yet.</p>
        ) : (
          <>
            <Select value={selectedManuscriptId} onValueChange={setSelectedManuscriptId}>
              <SelectTrigger className="w-full sm:w-96">
                <SelectValue placeholder="Select a manuscript" />
              </SelectTrigger>
              <SelectContent>
                {manuscripts.map((m) => (
                  <SelectItem key={m._id} value={m._id}>{m.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="bg-white rounded-lg shadow border border-gray-200 divide-y">
              {[...coAuthors, ...incompleteCoAuthors].length === 0 ? (
                <p className="p-6 text-center text-gray-500">No co-authors on this manuscript.</p>
              ) : (
                <>
                  {coAuthors.map((c) => (
                    <div key={c._id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-journal-rose flex items-center justify-center text-journal-maroon font-semibold">
                          {c.name?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{c.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                            <Mail className="h-3 w-3" /> {c.email}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-green-700">
                        <CheckCircle className="h-4 w-4" /> Complete
                      </span>
                    </div>
                  ))}

                  {incompleteCoAuthors.map((c) => (
                    <div key={c._id} className="p-4">
                      {editingId === c._id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input className="border rounded-md px-3 py-2 text-sm" placeholder="Name" value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                            <input className="border rounded-md px-3 py-2 text-sm" placeholder="Email" value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                            <input className="border rounded-md px-3 py-2 text-sm" placeholder="Faculty" value={editForm.faculty || ""} onChange={(e) => setEditForm({ ...editForm, faculty: e.target.value })} />
                            <input className="border rounded-md px-3 py-2 text-sm" placeholder="Affiliation" value={editForm.affiliation || ""} onChange={(e) => setEditForm({ ...editForm, affiliation: e.target.value })} />
                            <input className="border rounded-md px-3 py-2 text-sm sm:col-span-2" placeholder="ORCID (optional)" value={editForm.orcid || ""} onChange={(e) => setEditForm({ ...editForm, orcid: e.target.value })} />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{c.name || "Unnamed co-author"}</p>
                              <p className="text-sm text-orange-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Incomplete information
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => startEdit(c)}>
                            <Pencil className="h-4 w-4 mr-1" /> Complete Info
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </>
        )}
      </div>
      <Toaster />
    </AuthorLayout>
  );
}