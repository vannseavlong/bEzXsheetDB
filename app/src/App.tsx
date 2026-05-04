import './styles/index.css';
import { Toaster } from './components/ui/sonner';
import { Route, Routes } from 'react-router';
import HomePage from './page/home';
import useBlockForwardNavigation from './hooks/use-block-forward-navigation';
import Service from './page/service';
import Banner from './page/banner';
import { localesInitializer } from './locales/locales';
import { QueryClientProvider } from '@tanstack/react-query';
import customQueryClient from './hooks/use-custom-query-client';
// import useFakeAuth from './hooks/use-fake-auth';
import OrderDetail from './page/order-detail';
import Location from './page/location';
import Checkout from './page/checkout';
import AddLocation from './page/add-location';
import { AddressProvider } from './context/AddressContext';
import NotFound from './page/notfound';
// import PurchaseSuccessInterface from './page/purchase-success-screen';
import BookingContent from './page/booking-content';
import { AppProvider } from './context/AppContext';
import { NetworkConnectionDialog } from './components/common/network-connection-dialog';

if (import.meta.env.MODE === 'uat' || import.meta.env.MODE === 'dev') {
  import('vconsole').then((module) => {
    const VConsole = module.default;
    new VConsole();
  });
}

localesInitializer();

function App() {
  // useFakeAuth();
  useBlockForwardNavigation();

  return (
    <QueryClientProvider client={customQueryClient}>
      <AppProvider>
        <AddressProvider>
          <NetworkConnectionDialog />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/order" element={<BookingContent />} />
            <Route path="/v5/detail/:bulkOrderId" element={<OrderDetail />} />
            <Route path="/banner/:id" element={<Banner />} />
            <Route path="/service/:id" element={<Service />} />
            <Route path="/checkout/:productId/:serviceId/location" element={<Location />} />
            <Route path="/checkout/:productId/:serviceId/add-location" element={<AddLocation />} />
            <Route path="/checkout/:productId/:serviceId" element={<Checkout />} />
            {/* <Route path="/purchase/success" element={<PurchaseSuccessInterface />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-center" />
        </AddressProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
export default App;
