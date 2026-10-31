import { SidebarGroupLabel } from '@/components/ui/sidebar';
import lsdbLogo from '@/assets/lsdb-logo.png';

export function SidebarBrand() {
  return (
    <div className="flex flex-row items-center gap-3 h-18">
      <img src={lsdbLogo} className="w-12 h-auto rounded-[6px] shrink-0 object-contain" alt="LSDB logo" />
      <SidebarGroupLabel className="text-base font-semibold">LSDB Sandbox</SidebarGroupLabel>
    </div>
  );
}
