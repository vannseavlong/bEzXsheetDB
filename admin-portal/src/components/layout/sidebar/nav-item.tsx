import { NavLink } from 'react-router-dom';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavBadge } from './nav-badge';
import { cn } from '@/lib/utils';

type NavItemProps = {
  title: string;
  url: string;
  icon: React.ElementType;
  isActive?: boolean;
  isDisabled?: boolean;
  badge?: number;
  onClick?: () => void;
};

export function NavItem({ title, url, icon: Icon, isActive, isDisabled, badge, onClick }: NavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        size="lg"
        isActive={isActive}
        className={cn(isDisabled && 'pointer-events-none opacity-40')}
      >
        <NavLink
          to={url}
          onClick={onClick}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : undefined}
        >
          <Icon />
          <span className="flex-1">{title}</span>
          {badge !== undefined && <NavBadge count={badge} />}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
