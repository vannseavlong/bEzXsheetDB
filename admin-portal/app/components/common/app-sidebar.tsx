import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '../ui/sidebar';
import {
  Megaphone as PromotionIcon,
  Settings as Settings01Icon,
  ShoppingCart as ShoppingCart01Icon
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router';

const items = [
  { title: 'Order', url: '/order', icon: ShoppingCart01Icon },
  { title: 'Banner', url: '/banner', icon: PromotionIcon },
  { title: 'Category', url: '/category', icon: Settings01Icon },
  { title: 'Category Add-on', url: '/category-addon', icon: Settings01Icon },
  { title: 'Product', url: '/product', icon: Settings01Icon },
  { title: 'Product Option', url: '/product-option', icon: Settings01Icon }
];

function getBasePath(urlPath: string) {
  const secondSlashIndex = urlPath.indexOf('/', 1);
  if (secondSlashIndex !== -1) return urlPath.substring(0, secondSlashIndex);
  return urlPath;
}

export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar variant="inset" className="p-0">
      <SidebarContent className="p-6 bg-background">
        <SidebarGroup className="gap-6 p-0">
          <div className="flex flex-row items-center gap-3 h-18">
            <SidebarGroupLabel className="text-lg font-bold">bEasy Admin</SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={getBasePath(location.pathname) === item.url}
                  >
                    <NavLink to={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
