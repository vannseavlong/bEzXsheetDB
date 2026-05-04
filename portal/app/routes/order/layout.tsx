// import OrderHeader from '@/components/order/order-header';
import { Outlet } from 'react-router';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.ORDER,
  action: ACTIONS.VIEW
};

export default function Layout() {
  return (
    <main className="flex flex-col h-screen bg-background ">
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
}
