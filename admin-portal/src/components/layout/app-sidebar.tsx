import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { SidebarBrand } from './sidebar/sidebar-brand';
import { NavSection } from './sidebar/nav-section';
import { NavItem } from './sidebar/nav-item';
import { NavDropdown } from './sidebar/nav-dropdown';
import { navSections } from './sidebar/nav-config';
import { useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { usePermission } from '@/hooks/use-permission';

function SidebarLogoutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm flex flex-col p-0" aria-describedby={undefined}>
        <DialogHeader className="border-b px-4 py-1">
          <DialogTitle className="sr-only">Logout</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ChevronLeft className="size-5" />
          </Button>
        </DialogHeader>
        <div className="flex flex-col items-center text-center py-6 px-8">
          <LogOut className="text-red-500 size-10 mb-4" />
          <p className="font-medium mb-2">Are you sure you want to logout?</p>
          <p className="text-sm text-muted-foreground">You'll need to sign in again to access your account.</p>
        </div>
        <div className="p-4 flex gap-3">
          <Button className="flex-1" variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700" variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { hasPermission } = usePermission();

  const closeMobile = () => setOpenMobile(false);

  const canView = (module?: string) => !module || hasPermission(module, 'VIEW');

  return (
    <>
      <Sidebar variant="inset" className="p-0">
        <SidebarContent className="px-6 py-4 bg-background">
          <div className="flex flex-col gap-4">
            <SidebarBrand />

            {navSections.map((section) => {
              const visibleItems = section.items
                .map((item) => {
                  if (item.items) {
                    const visibleSubs = item.items.filter((sub) => canView(sub.module));
                    if (visibleSubs.length === 0) return null;
                    return { ...item, items: visibleSubs };
                  }
                  return canView(item.module) ? item : null;
                })
                .filter(Boolean) as typeof section.items;

              if (visibleItems.length === 0) return null;

              return (
                <NavSection key={section.label} label={section.label}>
                  {visibleItems.map((item) => {
                    if (item.items) {
                      return (
                        <NavDropdown
                          key={item.title}
                          title={item.title}
                          icon={item.icon}
                          isDisabled={item.disabled}
                          items={item.items}
                          onClick={closeMobile}
                        />
                      );
                    }

                    return (
                      <NavItem
                        key={item.title}
                        title={item.title}
                        url={item.url!}
                        icon={item.icon}
                        isActive={getBasePath(location.pathname) === item.url}
                        badge={item.badge}
                        isDisabled={item.disabled}
                        onClick={closeMobile}
                      />
                    );
                  })}
                </NavSection>
              );
            })}
          </div>
        </SidebarContent>

        <SidebarFooter className="px-6 py-4 bg-background border-t">
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </SidebarFooter>
      </Sidebar>

      <SidebarLogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
}

function getBasePath(urlPath: string) {
  const secondSlashIndex = urlPath.indexOf('/', 1);
  if (secondSlashIndex !== -1) return urlPath.substring(0, secondSlashIndex);
  return urlPath;
}
