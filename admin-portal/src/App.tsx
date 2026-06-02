import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import LoginPage from '@/pages/auth/LoginPage'
import AuthCallbackPage from '@/pages/auth/AuthCallbackPage'

import Dashboard from '@/pages/Dashboard'
import OrderPage from '@/pages/OrderPage'
import CalendarPage from '@/pages/CalendarPage'
import ChatPage from '@/pages/ChatPage'

import CleanerList from '@/pages/cleaner/CleanerList'
import CleanerForm from '@/pages/cleaner/CleanerForm'

import RoleList from '@/pages/role/RoleList'
import RoleForm from '@/pages/role/RoleForm'

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

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Full-screen authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/order" element={<OrderPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>

      {/* Layout-wrapped authenticated routes */}
      <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />

        {/* Cleaners */}
        <Route path="/cleaner" element={<CleanerList />} />
        <Route path="/cleaner/new" element={<CleanerForm />} />
        <Route path="/cleaner/:id" element={<CleanerForm />} />

        {/* Roles / RBAC */}
        <Route path="/roles" element={<RoleList />} />
        <Route path="/roles/new" element={<RoleForm />} />
        <Route path="/roles/:id" element={<RoleForm />} />

        {/* Partners */}
        <Route path="/partner" element={<PartnerList />} />
        <Route path="/partner/onboarding" element={<PartnerOnboarding />} />
        <Route path="/partner/tracking" element={<PartnerTracking />} />
        <Route path="/partner/payout" element={<PartnerPayout />} />
        <Route path="/partner/:id" element={<PartnerDetail />} />

        {/* Marketing */}
        <Route path="/overview" element={<MarketingOverview />} />
        <Route path="/coupon" element={<CouponList />} />
        <Route path="/coupon/:id" element={<CouponForm />} />
        <Route path="/payment-link" element={<PaymentLinkList />} />
        <Route path="/payment-link/:id" element={<PaymentLinkForm />} />
        <Route path="/banner" element={<BannerList />} />
        <Route path="/banner/new-banner" element={<BannerForm />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/push-notification" element={<PushNotificationList />} />
        <Route path="/push-notification/:id" element={<PushNotificationForm />} />
        <Route path="/push-notification/:id/detail" element={<PushNotificationDetail />} />

        {/* Finance */}
        <Route path="/finance-orders" element={<FinanceOrders />} />
        <Route path="/top-up" element={<TopUp />} />
        <Route path="/b-combos" element={<BCombos />} />
        <Route path="/direct-sales" element={<DirectSales />} />
        <Route path="/all-user" element={<AllUser />} />

        {/* Setup — Phase 10 complete */}
        <Route path="/category" element={<CategoryList />} />
        <Route path="/category/:id" element={<CategoryForm />} />
        <Route path="/category-addon" element={<CategoryAddonList />} />
        <Route path="/category-addon/:id" element={<CategoryAddonForm />} />
        <Route path="/popular-service" element={<PopularServiceList />} />
        <Route path="/popular-service/:id" element={<PopularServiceForm />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductForm />} />
        <Route path="/product-option" element={<ProductOptionList />} />
        <Route path="/product-option/:id" element={<ProductOptionForm />} />
        <Route path="/item" element={<ItemList />} />
        <Route path="/item/:id" element={<ItemForm />} />
        <Route path="/blocked-schedule" element={<BlockedScheduleList />} />
        <Route path="/blocked-schedule/:id" element={<BlockedScheduleForm />} />
        <Route path="/activity-log" element={<ActivityLog />} />

        {/* Customer Service */}
        <Route path="/customer-overview" element={<CustomerOverview />} />
        <Route path="/customer" element={<CustomerList />} />
        <Route path="/direct-sale-customer" element={<DirectSaleCustomer />} />
        <Route path="/registered-customer" element={<RegisteredCustomer />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/tickets/:id" element={<Tickets />} />
      </Route>
      </Route>
    </Routes>
  )
}
