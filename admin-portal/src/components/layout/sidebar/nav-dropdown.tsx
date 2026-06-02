import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export type DropdownSubItem = {
  title: string;
  url: string;
};

type NavDropdownProps = {
  title: string;
  icon: React.ElementType;
  items: DropdownSubItem[];
  isDisabled?: boolean;
  onClick?: () => void;
};

export function NavDropdown({ title, icon: Icon, items, isDisabled, onClick }: NavDropdownProps) {
  const location = useLocation();

  const activeUrl =
    items
      .filter(
        (item) => location.pathname === item.url || location.pathname.startsWith(item.url + '/')
      )
      .sort((a, b) => b.url.length - a.url.length)[0]?.url ?? null;

  const isAnyChildActive = activeUrl !== null;
  const [isOpen, setIsOpen] = React.useState(isAnyChildActive);

  React.useEffect(() => {
    if (isAnyChildActive) setIsOpen(true);
  }, [isAnyChildActive]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className={cn('gap-2', isDisabled && 'pointer-events-none opacity-40')}
            isActive={isAnyChildActive && !isOpen}
          >
            <Icon />
            <span className="flex-1">{title}</span>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub className="border-l-0 ml-0 pl-0 pr-0 mx-0">
            {items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.url}>
                <SidebarMenuSubButton
                  className="px-10"
                  asChild
                  isActive={activeUrl === subItem.url}
                >
                  <NavLink to={subItem.url} onClick={onClick}>
                    <span>{subItem.title}</span>
                  </NavLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
