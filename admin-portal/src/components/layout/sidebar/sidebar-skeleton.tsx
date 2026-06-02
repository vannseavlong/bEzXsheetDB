import { Skeleton } from '@/components/ui/skeleton';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const SECTION_ITEM_COUNTS = [2, 2, 3, 1];

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3 h-18">
        <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
        <Skeleton className="h-5 w-16" />
      </div>

      {SECTION_ITEM_COUNTS.map((count, sectionIdx) => (
        <SidebarGroup key={sectionIdx} className="gap-2 p-0">
          <Skeleton className="h-3 w-20 mb-1" />
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {Array.from({ length: count }).map((_, i) => (
                <SidebarMenuItem key={i}>
                  <div className="flex items-center gap-2 h-10 px-3">
                    <Skeleton className="w-5 h-5 rounded shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
}
