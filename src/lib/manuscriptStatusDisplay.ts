import { Manuscript } from "@/services/api";

// Internal status names never change — this is purely how they're worded
// on the author's side: in_reconciliation -> "Under Review",
// review_communicated -> "Decision Pending".
export const AUTHOR_STATUS_LABELS: Record<Manuscript["status"], string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  in_reconciliation: "Under Review",
  review_communicated: "Decision Pending",
  approved: "Approved",
  rejected: "Rejected",
  minor_revision: "Minor Revision Requested",
  major_revision: "Major Revision Requested",
  revised: "Revised",
  superseded: "Superseded",
};

export const AUTHOR_STATUS_BADGE_CLASS: Record<Manuscript["status"], string> = {
  submitted: "bg-blue-100 text-blue-800 border-blue-200",
  under_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_reconciliation: "bg-yellow-100 text-yellow-800 border-yellow-200",
  review_communicated: "bg-teal-100 text-teal-800 border-teal-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  minor_revision: "bg-orange-100 text-orange-800 border-orange-200",
  major_revision: "bg-orange-100 text-orange-800 border-orange-200",
  revised: "bg-cyan-100 text-cyan-800 border-cyan-200",
  superseded: "bg-gray-100 text-gray-500 border-gray-200",
};
