import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 rounded-sm transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-white hover:bg-destructive/90",
        outline: "text-foreground",
        // bEasy variants
        approve: "bg-[#E6F9F1] text-[#06C270] border-transparent px-2 py-1",
        reject:  "bg-[#FFEBEB] text-[#FF3B3B] border-transparent px-2 py-1",
        warning: "bg-[#FEF7E9] text-[#F6B024] border-transparent px-2 py-1",
        confirm: "bg-[#E8F0F7] text-[#102C90] border-transparent px-2 py-1",
        purple:  "bg-[#1b4cfa1a] text-[#1B4CFA] border-transparent px-2 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
