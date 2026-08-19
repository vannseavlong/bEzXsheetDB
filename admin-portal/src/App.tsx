import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import { MODULES } from '@/lib/permission-registry'
import LoginPage from '@/pages/auth/LoginPage'
import LandingPage from '@/pages/LandingPage'
import AuthCallbackPage from '@/pages/auth/AuthCallbackPage'

import Dashboard from '@/pages/Dashboard'
import OrderPage from '@/pages/OrderPage'
import CalendarPage from '@/pages/CalendarPage'
import ChatPage from '@/pages/ChatPage'

import CleanerList from '@/pages/cleaner/CleanerList'
import CleanerForm from '@/pages/cleaner/CleanerForm'

import RoleList from '@/pages/role/RoleList'
import RoleForm from '@/pages/role/RoleForm'
import UserList from '@/pages/users/UserList'
import NotAuthorised from '@/pages/NotAuthorised'

import PartnerList from '@/pages/partner/PartnerList'
import PartnerDetail from '@/pages/partner/PartnerDetail'
import PartnerOnboarding from '@/pages/partner/PartnerOnboarding'
import PartnerTracking from '@/pages/partner/PartnerTracking'
import PartnerPayout from '@/pages/partner/PartnerPayout'

import MarketingOverview from '@/pages/marketing/MarketingOverview'
import CouponList from '@/pages/coupon/CouponList'
import CouponForm from '@/pages/coupon/CouponForm'
import PaymentLinkList from '@/pages/payment-link/PaymentLinkList'
import PaymentLinkForm from '@/pages/payment-link/PaymentLinkForm'
import BannerList from '@/pages/banner/BannerList'
import BannerForm from '@/pages/banner/BannerForm'
import OtpPage from '@/pages/OtpPage'
import PushNotificationList from '@/pages/push-notification/PushNotificationList'
import PushNotificationForm from '@/pages/push-notification/PushNotificationForm'
import PushNotificationDetail from '@/pages/push-notification/PushNotificationDetail'

import FinanceOrders from '@/pages/finance/FinanceOrders'
import TopUp from '@/pages/finance/TopUp'
import BCombos from '@/pages/finance/BCombos'
import DirectSales from '@/pages/finance/DirectSales'
import AllUser from '@/pages/finance/AllUser'

import CategoryList from '@/pages/category/CategoryList'
import CategoryForm from '@/pages/category/CategoryForm'
import CategoryAddonList from '@/pages/category-addon/CategoryAddonList'
import CategoryAddonForm from '@/pages/category-addon/CategoryAddonForm'
import PopularServiceList from '@/pages/popular-service/PopularServiceList'
import PopularServiceForm from '@/pages/popular-service/PopularServiceForm'
import ProductList from '@/pages/product/ProductList'
import ProductForm from '@/pages/product/ProductForm'
import ProductOptionList from '@/pages/product-option/ProductOptionList'
import ProductOptionForm from '@/pages/product-option/ProductOptionForm'
import ItemList from '@/pages/item/ItemList'
import ItemForm from '@/pages/item/ItemForm'
import BlockedScheduleList from '@/pages/blocked-schedule/BlockedScheduleList'
import BlockedScheduleForm from '@/pages/blocked-schedule/BlockedScheduleForm'
import ActivityLog from '@/pages/ActivityLog'

import CustomerOverview from '@/pages/customer-service/CustomerOverview'
import CustomerList from '@/pages/customer-service/CustomerList'
import DirectSaleCustomer from '@/pages/customer-service/DirectSaleCustomer'
import RegisteredCustomer from '@/pages/customer-service/RegisteredCustomer'
import Tickets from '@/pages/customer-service/Tickets'

import TermsOfUse from '@/pages/legal/TermsOfUse'
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/not-authorised" element={<NotAuthorised />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      {/* Full-screen authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedRoute module={MODULES.ORDER} />}>
          <Route path="/order" element={<OrderPage />} />
        </Route>
        <Route path="/calendar" element={<CalendarPage />} />
        <Route element={<ProtectedRoute module={MODULES.CHAT} />}>
          <Route path="/chat" element={<ChatPage />} />
        </Route>
      </Route>

      {/* Homepage: public landing page for signed-out visitors, Dashboard for signed-in staff.
          publicFallback keeps "/" from bouncing straight to /login, since it also serves as
          the app's OAuth-branding "Application home page" and must describe the app on its own. */}
      <Route path="/" element={<ProtectedRoute publicFallback={<LandingPage />} />}>
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute module={MODULES.DASHBOARD} />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Layout-wrapped authenticated routes */}
      <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        {/* Cleaners */}
        <Route element={<ProtectedRoute module={MODULES.CLEANER} />}>
          <Route path="/cleaner" element={<CleanerList />} />
          <Route path="/cleaner/new" element={<CleanerForm />} />
          <Route path="/cleaner/:id" element={<CleanerForm />} />
        </Route>

        {/* Roles / RBAC */}
        <Route element={<ProtectedRoute module={MODULES.RBAC} />}>
          <Route path="/roles" element={<RoleList />} />
          <Route path="/roles/new" element={<RoleForm />} />
          <Route path="/roles/:id" element={<RoleForm />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.ADMIN_USERS} />}>
          <Route path="/admin-users" element={<UserList />} />
        </Route>

        {/* Partners */}
        <Route element={<ProtectedRoute module={MODULES.PARTNER} />}>
          <Route path="/partner" element={<PartnerList />} />
          <Route path="/partner/:id" element={<PartnerDetail />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.PARTNER_ONBOARDING} />}>
          <Route path="/partner/onboarding" element={<PartnerOnboarding />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.PARTNER_TRACKING} />}>
          <Route path="/partner/tracking" element={<PartnerTracking />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.PARTNER_PAYOUT} />}>
          <Route path="/partner/payout" element={<PartnerPayout />} />
        </Route>

        {/* Marketing */}
        <Route element={<ProtectedRoute module={MODULES.MARKETING_OVERVIEW} />}>
          <Route path="/overview" element={<MarketingOverview />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.MARKETING_COUPON} />}>
          <Route path="/coupon" element={<CouponList />} />
          <Route path="/coupon/:id" element={<CouponForm />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.MARKETING_PAYMENT_LINK} />}>
          <Route path="/payment-link" element={<PaymentLinkList />} />
          <Route path="/payment-link/:id" element={<PaymentLinkForm />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.MARKETING_OTP} />}>
          <Route path="/otp" element={<OtpPage />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.MARKETING_BANNER} />}>
          <Route path="/banner" element={<BannerList />} />
          <Route path="/banner/new-banner" element={<BannerForm />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.MARKETING_NOTIFICATION} />}>
          <Route path="/push-notification" element={<PushNotificationList />} />
          <Route path="/push-notification/:id" element={<PushNotificationForm />} />
          <Route path="/push-notification/:id/detail" element={<PushNotificationDetail />} />
        </Route>

        {/* Finance */}
        <Route element={<ProtectedRoute module={MODULES.FINANCE_ORDER} />}>
          <Route path="/finance-orders" element={<FinanceOrders />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.FINANCE_TOPUP} />}>
          <Route path="/top-up" element={<TopUp />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.FINANCE_BCOMBO} />}>
          <Route path="/b-combos" element={<BCombos />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.FINANCE_DIRECT_SALES} />}>
          <Route path="/direct-sales" element={<DirectSales />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.MARKETING_ALL_USER} />}>
          <Route path="/all-user" element={<AllUser />} />
        </Route>

        {/* Setup — catalog entities, each with its own permission module */}
        <Route element={<ProtectedRoute module={MODULES.CATEGORY} />}>
          <Route path="/category" element={<CategoryList />} />
          <Route path="/category/:id" element={<CategoryForm />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.CATEGORY_ADDON} />}>
          <Route path="/category-addon" element={<CategoryAddonList />} />
          <Route path="/category-addon/:id" element={<CategoryAddonForm />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.POPULAR_SERVICE} />}>
          <Route path="/popular-service" element={<PopularServiceList />} />
          <Route path="/popular-service/:id" element={<PopularServiceForm />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.PRODUCT} />}>
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductForm />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.PRODUCT_OPTION} />}>
          <Route path="/product-option" element={<ProductOptionList />} />
          <Route path="/product-option/:id" element={<ProductOptionForm />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.SETUP_ITEM} />}>
          <Route path="/item" element={<ItemList />} />
          <Route path="/item/:id" element={<ItemForm />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.SETUP_SCHEDULE} />}>
          <Route path="/blocked-schedule" element={<BlockedScheduleList />} />
          <Route path="/blocked-schedule/:id" element={<BlockedScheduleForm />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.ACTIVITY_LOG} />}>
          <Route path="/activity-log" element={<ActivityLog />} />
        </Route>

        {/* Customer Service */}
        <Route element={<ProtectedRoute module={MODULES.CUSTOMER_OVERVIEW} />}>
          <Route path="/customer-overview" element={<CustomerOverview />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.CUSTOMER_REGISTERED} />}>
          <Route path="/customer" element={<CustomerList />} />
          <Route path="/registered-customer" element={<RegisteredCustomer />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.CUSTOMER_DIRECT_SALE} />}>
          <Route path="/direct-sale-customer" element={<DirectSaleCustomer />} />
        </Route>
        <Route element={<ProtectedRoute module={MODULES.CUSTOMER_TICKETS} />}>
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/:id" element={<Tickets />} />
        </Route>
      </Route>
      </Route>
    </Routes>
  )
}
