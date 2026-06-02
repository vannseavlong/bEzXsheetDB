import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import type { ReactNode } from 'react';

type NavSectionProps = {
  label?: string;
  children: ReactNode;
};

export function NavSection({ label, children }: NavSectionProps) {
  return (
    <SidebarGroup className="gap-2 p-0">
      {label && (
        <SidebarGroupLabel className="px-0 text-xs font-medium text-muted-foreground">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="gap-1.5">{children}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
