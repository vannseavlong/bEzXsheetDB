import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '../ui/sidebar';
import {
  Calendar03Icon,
  CleanIcon,
  DashboardSquare01Icon,
  PromotionIcon,
  SaveMoneyDollarIcon,
  Settings01Icon,
  ShoppingCart01Icon,
  UserGroupIcon
} from 'hugeicons-react';
import beasyIcon from '../../../public/beasy-icon.png';
import { NavLink, useLocation } from 'react-router';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ACTIONS, MODULES } from '@/lib/permission';
import { usePermission } from '@/hooks/use-permission';

// type MenuItem = {
//   title: string;
//   url?: string;
//   icon: React.ElementType;
//   items?: { title: string; url: string; isActive?: boolean }[];
// };

// Menu items.
const items = [
  {
    title: 'appSidebar.dashboard',
    url: '/',
    icon: DashboardSquare01Icon,
    modules: []
  },
  {
    title: 'appSidebar.order',
    url: '/order',
    icon: ShoppingCart01Icon,
    modules: [MODULES.ORDER]
  },
  {
    title: 'appSidebar.calendar',
    url: '/calendar',
    icon: Calendar03Icon,
    modules: [MODULES.ORDER]
  },
  {
    title: 'appSidebar.finance',
    icon: SaveMoneyDollarIcon,
    modules: [
      MODULES.FINANCE_ORDER,
      MODULES.FINANCE_TOPUP,
      MODULES.FINANCE_BCOMBO,
      MODULES.FINANCE_DIRECT_SALES
    ],
    items: [
      {
        title: 'appSidebar.orders',
        url: '/finance-orders',
        isActive: true,
        module: MODULES.FINANCE_ORDER
      },
      {
        title: 'appSidebar.topUp',
        url: '/top-up',
        module: MODULES.FINANCE_TOPUP
      },
      {
        title: 'appSidebar.bCombos',
        url: '/b-combos',
        module: MODULES.FINANCE_BCOMBO
      },
      {
        title: 'appSidebar.directSales',
        url: '/direct-sales',
        module: MODULES.FINANCE_DIRECT_SALES
      },
      {
        title: 'appSidebar.allUser',
        url: '/all-user',
        isActive: true,
        module: MODULES.MARKETING_CUSTOMER
      },
      {
        title: 'appSidebar.coupons',
        url: '/coupons',
        module: MODULES.MARKETING_COUPON
      }
    ]
  },
  {
    title: 'Customer Service',
    icon: UserGroupIcon,
    modules: [MODULES.MARKETING_CUSTOMER],
    items: [
      {
        title: 'Overview',
        url: '/customer-overview',
        isActive: true,
        module: MODULES.MARKETING_OVERVIEW
      },
      {
        title: 'appSidebar.customer',
        url: '/customer',
        isActive: true,
        module: MODULES.MARKETING_CUSTOMER
      },
      {
        title: 'Direct Sales',
        url: '/direct-sale-customer',
        module: MODULES.MARKETING_CUSTOMER
      },
      {
        title: 'Registered Customers',
        url: '/registered-customer',
        module: MODULES.MARKETING_CUSTOMER
      }
    ]
  },
  {
    title: 'appSidebar.cleaners',
    icon: CleanIcon,
    modules: [MODULES.CLEANER],
    items: [
      {
        title: 'appSidebar.cleaners',
        url: '/cleaner',
        isActive: true,
        module: MODULES.CLEANER
      }
    ]
  },
  {
    title: 'appSidebar.marketing',
    icon: PromotionIcon,
    modules: [
      // MODULES.MARKETING_CUSTOMER,
      MODULES.MARKETING_COUPON,
      MODULES.MARKETING_PAYMENT_LINK,
      MODULES.MARKETING_OTP,
      MODULES.MARKETING_NOTIFICATION,
      MODULES.MARKETING_OVERVIEW
    ],
    items: [
      {
        title: 'Overview',
        url: '/overview',
        isActive: true,
        module: MODULES.MARKETING_OVERVIEW
      },
      {
        title: 'appSidebar.coupon',
        url: '/coupon',
        module: MODULES.MARKETING_COUPON
      },
      {
        title: 'Payment Link',
        url: '/payment-link',
        module: MODULES.MARKETING_PAYMENT_LINK
      },
      {
        title: 'appSidebar.otp',
        url: '/otp',
        module: MODULES.MARKETING_OTP
      },
      {
        title: 'appSidebar.banner',
        url: '/banner',
        module: MODULES.MARKETING_BANNER
      },
      // {
      //   title: 'appSidebar.serviceBundle',
      //   url: '/service-bundle'
      // },
      // {
      //   title: 'appSidebar.topUp',
      //   url: '/top-up'
      // },
      // {
      //   title: 'appSidebar.voucher',
      //   url: '/voucher'
      // },
      // {
      //   title: 'appSidebar.promotions',
      //   url: '/promotions'
      // },
      // {
      //   title: 'appSidebar.referralProgram',
      //   url: '/referral-program'
      // },
      {
        title: 'appSidebar.pushNotification',
        url: '/push-notification',
        module: MODULES.MARKETING_NOTIFICATION
      }
    ]
  },
  {
    title: 'appSidebar.setup',
    icon: Settings01Icon,
    modules: [MODULES.SETUP_ITEM, MODULES.SETUP_SCHEDULE],
    items: [
      {
        title: 'appSidebar.category',
        url: '/category',
        module: MODULES.SETUP_ITEM,
        action: ACTIONS.VIEW
      },
      {
        title: 'appSidebar.categoryAddon',
        url: '/category-addon',
        module: MODULES.SETUP_ITEM,
        action: ACTIONS.VIEW
      },
      {
        title: 'appSidebar.product',
        url: '/product',
        module: MODULES.SETUP_ITEM,
        action: ACTIONS.VIEW
      },
      {
        title: 'appSidebar.productOption',
        url: '/product-option',
        module: MODULES.SETUP_ITEM,
        action: ACTIONS.VIEW
      },
      {
        title: 'appSidebar.items',
        url: '/item',
        isActive: true,
        module: MODULES.SETUP_ITEM,
        action: ACTIONS.VIEW
      },
      {
        title: 'appSidebar.blockedSchedule',
        url: '/blocked-schedule',
        module: MODULES.SETUP_SCHEDULE,
        action: ACTIONS.VIEW
      },
      {
        title: 'Activity Log',
        url: '/activity-log',
        module: MODULES.ACTIVITY_LOG,
        action: ACTIONS.VIEW
      }
      // {
      //   title: 'appSidebar.users',
      //   url: '/users',
      //   isActive: true
      // },
      // {
      //   title: 'appSidebar.roles',
      //   url: '/roles'
      // }
    ]
  }
];
export function AppSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { hasPermission } = usePermission();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar variant="inset" className="p-0">
      <SidebarContent className="p-6 bg-background">
        <SidebarGroup className="gap-6 p-0">
          <div className="flex flex-row items-center gap-3 h-18">
            <img src={beasyIcon} className="w-12 h-12 rounded-lg" />
            <SidebarGroupLabel>bEasy</SidebarGroupLabel>
          </div>
          {items.length > 0 && (
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {items.map((item) => {
                  if (
                    item.modules.length > 0 &&
                    !item.modules.find((mod) => hasPermission(mod, ACTIONS.VIEW))
                  )
                    return null;
                  if (item.items) {
                    return (
                      <Collapsible key={item.title} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton size="lg" className="gap-2">
                              <item.icon />
                              <div className="flex-1">
                                <span>{t(item.title)}</span>
                              </div>
                              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className="border-l-0 ml-0 pl-0 pr-0 mx-0">
                              {item.items.map(
                                (subItem) =>
                                  (!subItem.module ||
                                    hasPermission(subItem.module, ACTIONS.VIEW)) && (
                                    <SidebarMenuSubItem key={subItem.title}>
                                      <SidebarMenuSubButton
                                        className="px-10"
                                        asChild
                                        isActive={getBasePath(location.pathname) === subItem.url}
                                      >
                                        <NavLink
                                          to={subItem.url}
                                          onClick={() => setOpenMobile(false)}
                                        >
                                          <span>{t(subItem.title)}</span>
                                        </NavLink>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  )
                              )}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        size="lg"
                        isActive={getBasePath(location.pathname) === item.url}
                      >
                        <NavLink to={item.url} onClick={() => setOpenMobile(false)}>
                          <item.icon />
                          <span>{t(item.title)}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
function getBasePath(urlPath: string) {
  const secondSlashIndex = urlPath.indexOf('/', 1);
  if (secondSlashIndex !== -1) return urlPath.substring(0, secondSlashIndex);
  return urlPath;
}
