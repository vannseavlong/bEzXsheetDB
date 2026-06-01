import { Badge } from "@/components/ui/badge";

const STATUS_MAP = {
  // success (green)
  ACTIVE: { variant: "success", label: "Active" },
  active: { variant: "success", label: "Active" },
  true: { variant: "success", label: "Active" },
  APPROVED: { variant: "success", label: "Approved" },
  COMPLETED: { variant: "success", label: "Completed" },
  RESOLVED: { variant: "success", label: "Resolved" },
  USED: { variant: "success", label: "Used" },

  // warning (yellow)
  PENDING: { variant: "warning", label: "Pending" },
  IN_REVIEW: { variant: "warning", label: "In Review" },
  UNDER_REVIEW: { variant: "warning", label: "Under Review" },
  DEDUCTION_PENDING: { variant: "warning", label: "Deduction Pending" },
  SCHEDULED: { variant: "warning", label: "Scheduled" },
  OTP_ACTIVE: { variant: "warning", label: "Active" },

  // destructive (red)
  INACTIVE: { variant: "destructive", label: "Inactive" },
  false: { variant: "destructive", label: "Inactive" },
  BANNED: { variant: "destructive", label: "Banned" },
  REJECTED: { variant: "destructive", label: "Rejected" },
  CANCELLED: { variant: "destructive", label: "Cancelled" },
  FAILED: { variant: "destructive", label: "Failed" },
  EXPIRED: { variant: "destructive", label: "Expired" },

  // info (blue)
  IN_PROGRESS: { variant: "info", label: "In Progress" },
  PROCESSING: { variant: "info", label: "Processing" },
  DRAFT: { variant: "info", label: "Draft" },
};

export function StatusBadge({
  status,
  label,
}: {
  status?: string | boolean | null;
  label?: string;
}) {
  if (status === null || status === undefined) {
    return <Badge variant="secondary">{label ?? "Unknown"}</Badge>;
  }

  const key = typeof status === "boolean" ? String(status) : String(status).toUpperCase();
  const normalizedKey =
    (STATUS_MAP as any)[key] ? key : (STATUS_MAP as any)[String(status)] ? String(status) : String(status);

  const config = (STATUS_MAP as any)[normalizedKey] ?? (STATUS_MAP as any)[String(status)] ?? null;

  const variant = config?.variant ?? "secondary";
  const displayLabel = label ?? config?.label ?? String(status);

  return <Badge variant={variant as any}>{displayLabel}</Badge>;
}
