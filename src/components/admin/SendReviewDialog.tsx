"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { manuscriptReviewApi } from "@/services/api";

interface ReviewerOption {
  id: string;
  name: string;
  commentsForAuthor?: string;
}

interface SendReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manuscriptId: string;
  manuscriptTitle: string;
  reviewers: ReviewerOption[];
  onSent: () => void;
}

export function SendReviewDialog({
  open, onOpenChange, manuscriptId, manuscriptTitle, reviewers, onSent,
}: SendReviewDialogProps) {
  const [allowRevision, setAllowRevision] = useState(true);
  const [comments, setComments] = useState("");
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>(
    reviewers.length === 1 ? [reviewers[0].id] : []
  );
  const [submitting, setSubmitting] = useState(false);

  const multipleReviewers = reviewers.length > 1;
  const singleReviewerComment = reviewers.length === 1 ? reviewers[0].commentsForAuthor : undefined;

  const toggleReviewer = (id: string) => {
    setSelectedReviewers((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (multipleReviewers && !comments.trim()) {
      toast.error("Please add a summary comment for the author.");
      return;
    }
    if (multipleReviewers && selectedReviewers.length === 0) {
      toast.error("Select at least one reviewer to receive the revision.");
      return;
    }
    try {
      setSubmitting(true);
      await manuscriptReviewApi.sendReviewToAuthor(manuscriptId, {
        allowRevision,
        commentsForAuthor: multipleReviewers ? comments : undefined,
        reviewerIds: multipleReviewers ? selectedReviewers : undefined,
      });
      toast.success("Review sent to author.");
      onOpenChange(false);
      onSent();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send review to author.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Review to Author</DialogTitle>
          <DialogDescription className="truncate">{manuscriptTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Revision option</label>
            <div className="flex gap-3">
              <Button type="button" variant={allowRevision ? "default" : "outline"} onClick={() => setAllowRevision(true)} className="flex-1">
                With revision
              </Button>
              <Button type="button" variant={!allowRevision ? "default" : "outline"} onClick={() => setAllowRevision(false)} className="flex-1">
                Without revision
              </Button>
            </div>
          </div>

          {multipleReviewers && (
            <div>
              <label className="block text-sm font-medium mb-2">Reviewer(s) to receive the revision</label>
              <div className="space-y-2">
                {reviewers.map((r) => (
                  <label key={r.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={selectedReviewers.includes(r.id)} onChange={() => toggleReviewer(r.id)} />
                    {r.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {multipleReviewers ? (
            <div>
              <label className="block text-sm font-medium mb-2">Comment for author</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={6}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-journal-maroon"
                placeholder="Summarize the reviewer feedback for the author..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Comment for author</label>
              <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {singleReviewerComment || (
                  <span className="text-gray-400 italic">This reviewer left no comment for the author.</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only one reviewer completed a review — their existing comment will be sent as-is.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSend} disabled={submitting}>{submitting ? "Sending..." : "Send Review"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}