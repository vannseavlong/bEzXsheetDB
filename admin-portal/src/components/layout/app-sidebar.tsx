import { Sidebar, SidebarContent, useSidebar } from '@/components/ui/sidebar';
import { SidebarBrand } from './sidebar/sidebar-brand';
import { NavSection } from './sidebar/nav-section';
import { NavItem } from './sidebar/nav-item';
import { NavDropdown } from './sidebar/nav-dropdown';
import { navSections } from './sidebar/nav-config';
import { useLocation } from 'react-router-dom';

export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  const closeMobile = () => setOpenMobile(false);

  return (
    <Sidebar variant="inset" className="p-0">
      <SidebarContent className="px-6 py-4 bg-background">
        <div className="flex flex-col gap-4">
          <SidebarBrand />

          {navSections.map((section) => (
            <NavSection key={section.label} label={section.label}>
              {section.items.map((item) => {
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
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

function getBasePath(urlPath: string) {
  const secondSlashIndex = urlPath.indexOf('/', 1);
  if (secondSlashIndex !== -1) return urlPath.substring(0, secondSlashIndex);
  return urlPath;
}
