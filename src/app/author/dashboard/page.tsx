"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AuthorLayout } from "@/components/authors/AuthorLayout";
import { useAuth } from "@/contexts/AuthContext";
import { authorPortalApi, type AuthorDashboardManuscript } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, FileText, Eye, AlertCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { AUTHOR_STATUS_LABELS, AUTHOR_STATUS_BADGE_CLASS } from "@/lib/manuscriptStatusDisplay";

export default function AuthorDashboardPage() {
  const { isAuthenticated } = useAuth();
  const [manuscripts, setManuscripts] = useState<AuthorDashboardManuscript[]>([]);
  const [stats, setStats] = useState<{ totalManuscripts: number; statusCounts: Record<string, number> } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await authorPortalApi.getDashboard();
      setManuscripts(response.data.manuscripts);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to load author dashboard:", error);
      toast.error("Failed to load your manuscripts");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const decisionPendingCount =
    (stats?.statusCounts?.review_communicated || 0) +
    (stats?.statusCounts?.in_reconciliation || 0) +
    (stats?.statusCounts?.under_review || 0);
  const needsRevisionCount = (stats?.statusCounts?.minor_revision || 0) + (stats?.statusCounts?.major_revision || 0);

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
      <div className="space-y-6 p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">My Manuscripts</h1>
            <p className="text-gray-600 mt-1">Track the status of your submissions</p>
          </div>
          <Button onClick={loadDashboard} variant="outline" className="border-journal-maroon text-journal-maroon hover:bg-journal-rose">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-journal-maroon">
            <CardHeader className="pb-2">
              <CardDescription>Total Manuscripts</CardDescription>
              <CardTitle className="text-3xl text-journal-maroon">{stats?.totalManuscripts ?? 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardDescription>In Review / Decision Pending</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{decisionPendingCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardDescription>Needs Your Revision</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{needsRevisionCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-journal-off-white to-white border-b border-gray-200">
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-journal-maroon" />
              Submissions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Title</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 hidden md:table-cell">Last Updated</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {manuscripts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        You have not submitted any manuscripts yet.
                      </td>
                    </tr>
                  ) : (
                    manuscripts.map((manuscript) => (
                      <tr key={manuscript._id} className="border-b hover:bg-journal-rose transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 max-w-sm truncate">{manuscript.title}</p>
                          {manuscript.status === "review_communicated" && manuscript.revisionAllowed && (
                            <span className="inline-flex items-center gap-1 text-xs text-orange-600 mt-1">
                              <AlertCircle className="h-3 w-3" /> Revision requested
                            </span>
                          )}
                          {manuscript.status === "superseded" && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-1">
                              Superseded by a newer revision
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`${AUTHOR_STATUS_BADGE_CLASS[manuscript.status]} border`}>
                            {AUTHOR_STATUS_LABELS[manuscript.status]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                          {new Date(manuscript.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/author/manuscripts/${manuscript._id}`}>
                            <Button size="sm" variant="outline" className="border-journal-maroon text-journal-maroon hover:bg-journal-rose">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </AuthorLayout>
  );
}