import { Badge } from "@/components/ui/badge"
import type { BadgeProps } from "@/components/ui/badge"

type BadgeVariant = BadgeProps["variant"]

const STATUS_MAP: Record<string, { variant: BadgeVariant; label: string }> = {
  // approve (green) — bEasy variant
  ACTIVE:     { variant: "approve", label: "Active" },
  active:     { variant: "approve", label: "Active" },
  true:       { variant: "approve", label: "Active" },
  APPROVED:   { variant: "approve", label: "Approved" },
  COMPLETED:  { variant: "approve", label: "Completed" },
  RESOLVED:   { variant: "approve", label: "Resolved" },
  USED:       { variant: "approve", label: "Used" },
  SUCCESS:    { variant: "approve", label: "Success" },

  // warning (yellow) — bEasy variant
  PENDING:            { variant: "warning", label: "Pending" },
  IN_REVIEW:          { variant: "warning", label: "In Review" },
  UNDER_REVIEW:       { variant: "warning", label: "Under Review" },
  DEDUCTION_PENDING:  { variant: "warning", label: "Deduction Pending" },
  SCHEDULED:          { variant: "warning", label: "Scheduled" },
  OTP_ACTIVE:         { variant: "warning", label: "Active" },
  IN_PROGRESS:        { variant: "warning", label: "In Progress" },

  // reject (red) — bEasy variant
  INACTIVE:   { variant: "reject", label: "Inactive" },
  false:      { variant: "reject", label: "Inactive" },
  BANNED:     { variant: "reject", label: "Banned" },
  REJECTED:   { variant: "reject", label: "Rejected" },
  CANCELLED:  { variant: "reject", label: "Cancelled" },
  FAILED:     { variant: "reject", label: "Failed" },
  EXPIRED:    { variant: "reject", label: "Expired" },

  // confirm (blue) — bEasy variant
  DRAFT:      { variant: "confirm", label: "Draft" },
  PROCESSING: { variant: "confirm", label: "Processing" },
  SENT:       { variant: "confirm", label: "Sent" },

  // purple — bEasy variant
  SUBMITTED:  { variant: "purple", label: "Submitted" },
  PAID:       { variant: "purple", label: "Paid" },
}

export function StatusBadge({
  status,
  label,
}: {
  status?: string | boolean | null
  label?: string
}) {
  if (status === null || status === undefined) {
    return <Badge variant="secondary">{label ?? "Unknown"}</Badge>
  }

  const key = typeof status === "boolean" ? String(status) : String(status).toUpperCase()
  const config = STATUS_MAP[key] ?? STATUS_MAP[String(status)] ?? null

  const variant = config?.variant ?? "secondary"
  const displayLabel = label ?? config?.label ?? String(status)

  return <Badge variant={variant}>{displayLabel}</Badge>
}
