import { SidebarGroupLabel } from '@/components/ui/sidebar';
import beasyIcon from '@/assets/beasy-icon.png';

export function SidebarBrand() {
  return (
    <div className="flex flex-row items-center gap-3 h-18">
      <img src={beasyIcon} className="w-12 h-12 rounded-[6px] shrink-0" alt="bEasy logo" />
      <SidebarGroupLabel className="text-base font-semibold">bEasy</SidebarGroupLabel>
    </div>
  );
}
