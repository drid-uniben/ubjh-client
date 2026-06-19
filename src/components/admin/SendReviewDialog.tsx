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
}

interface SendReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manuscriptId: string;
  manuscriptTitle: string;
  reviewers: ReviewerOption[]; // completed reviewers for this manuscript
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

  const toggleReviewer = (id: string) => {
    setSelectedReviewers((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (!comments.trim()) {
      toast.error("Please add a summary comment for the author.");
      return;
    }
    if (reviewers.length > 1 && selectedReviewers.length === 0) {
      toast.error("Select at least one reviewer to receive the revision.");
      return;
    }
    try {
      setSubmitting(true);
      await manuscriptReviewApi.sendReviewToAuthor(manuscriptId, {
        allowRevision,
        commentsForAuthor: comments,
        reviewerIds: reviewers.length > 1 ? selectedReviewers : undefined,
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
              <Button
                type="button"
                variant={allowRevision ? "default" : "outline"}
                onClick={() => setAllowRevision(true)}
                className="flex-1"
              >
                With revision
              </Button>
              <Button
                type="button"
                variant={!allowRevision ? "default" : "outline"}
                onClick={() => setAllowRevision(false)}
                className="flex-1"
              >
                Without revision
              </Button>
            </div>
          </div>

          {reviewers.length > 1 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Reviewer(s) to receive the revision
              </label>
              <div className="space-y-2">
                {reviewers.map((r) => (
                  <label key={r.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedReviewers.includes(r.id)}
                      onChange={() => toggleReviewer(r.id)}
                    />
                    {r.name}
                  </label>
                ))}
              </div>
            </div>
          )}

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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={submitting}>
            {submitting ? "Sending..." : "Send Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}