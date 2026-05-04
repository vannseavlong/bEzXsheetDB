// import OrderHeader from '@/components/order/order-header';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <main className="flex flex-col h-screen bg-background ">
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
}
