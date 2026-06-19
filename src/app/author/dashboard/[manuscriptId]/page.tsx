"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthorLayout } from "@/components/authors/AuthorLayout";
import { authorPortalApi, manuscriptApi, type AuthorDashboardManuscript } from "@/services/api";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "sonner";
import { Loader2, ArrowLeft, Calendar, MessageSquare, UploadCloud, Link2 } from "lucide-react";
import { AUTHOR_STATUS_LABELS, AUTHOR_STATUS_BADGE_CLASS } from "@/lib/manuscriptStatusDisplay";

export default function AuthorManuscriptDetailPage() {
  const { manuscriptId } = useParams<{ manuscriptId: string }>();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [manuscript, setManuscript] = useState<AuthorDashboardManuscript | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [revisionFile, setRevisionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadManuscript = useCallback(async () => {
    if (!isAuthenticated || !manuscriptId) return;
    try {
      setIsLoading(true);
      const response = await authorPortalApi.getManuscriptDetails(manuscriptId);
      setManuscript(response.data);
    } catch (error) {
      console.error("Failed to load manuscript:", error);
      toast.error("Failed to load manuscript details");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, manuscriptId]);

  useEffect(() => {
    loadManuscript();
  }, [loadManuscript]);

  const handleSubmitRevision = async () => {
    if (!manuscript || !revisionFile) {
      toast.error("Please select your revised manuscript file first.");
      return;
    }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("manuscriptFile", revisionFile);
      const response = await manuscriptApi.submitPostReviewRevision(manuscript._id, formData);
      toast.success("Revision submitted successfully.");
      if (response.data?.manuscriptId) {
        router.push(`/author/dashboard/${response.data.manuscriptId}`);
      } else {
        loadManuscript();
      }
    } catch (error) {
      console.error("Failed to submit revision:", error);
      toast.error("Failed to submit revision");
    } finally {
      setSubmitting(false);
    }
  };

  const linkedManuscript = (
    ref: AuthorDashboardManuscript["revisedFrom"]
  ): { id: string; title: string } | null => {
    if (!ref) return null;
    if (typeof ref === "string") return { id: ref, title: "manuscript" };
    return { id: ref._id, title: ref.title };
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

  if (!manuscript) {
    return (
      <AuthorLayout>
        <div className="p-6 text-center text-gray-500">Manuscript not found.</div>
      </AuthorLayout>
    );
  }

  const previous = linkedManuscript(manuscript.revisedFrom);
  const next = linkedManuscript(manuscript.supersededBy);
  const canSubmitRevision = manuscript.status === "review_communicated" && manuscript.revisionAllowed;

  return (
    <AuthorLayout>
      <div className="py-6 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" className="text-journal-maroon" onClick={() => router.push("/author/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Manuscripts
        </Button>

        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-journal-off-white to-white border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{manuscript.title}</h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Submitted {new Date(manuscript.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge className={`${AUTHOR_STATUS_BADGE_CLASS[manuscript.status]} border`}>
              {AUTHOR_STATUS_LABELS[manuscript.status]}
            </Badge>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {(previous || next) && (
              <div className="flex flex-wrap gap-3 text-sm">
                {previous && (
                  <a href={`/author/dashboard/${previous.id}`} className="inline-flex items-center gap-1 text-journal-maroon hover:underline">
                    <Link2 className="h-4 w-4" /> View original submission
                  </a>
                )}
                {next && (
                  <a href={`/author/dashboard/${next.id}`} className="inline-flex items-center gap-1 text-journal-maroon hover:underline">
                    <Link2 className="h-4 w-4" /> View your latest revision
                  </a>
                )}
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Abstract</h4>
              <p className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200 whitespace-pre-line">{manuscript.abstract}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {manuscript.keywords?.map((keyword, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-journal-rose text-journal-maroon border border-[#E6B6C2]">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Your Manuscript File</h4>
              <a href={manuscript.pdfFile} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-journal-maroon hover:underline">
                View submitted file
              </a>
            </div>

            {manuscript.reviewComments?.commentsForAuthor && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-journal-maroon" /> Reviewer Feedback
                </h4>
                <p className="text-sm bg-journal-off-white p-4 rounded-md border border-journal-mauve whitespace-pre-line">
                  {manuscript.reviewComments.commentsForAuthor}
                </p>
              </div>
            )}

            {canSubmitRevision && (
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <UploadCloud className="h-4 w-4 text-journal-maroon" /> Submit Revised Manuscript
                </h4>
                <FileUpload onFileSelect={setRevisionFile} />
                <Button onClick={handleSubmitRevision} disabled={submitting || !revisionFile} className="mt-4 bg-journal-maroon hover:bg-journal-maroon-dark">
                  {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>) : "Submit Revision"}
                </Button>
              </div>
            )}

            {manuscript.status === "review_communicated" && !manuscript.revisionAllowed && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                No revision is needed at this time. A final decision will be communicated to you separately.
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </AuthorLayout>
  );
}