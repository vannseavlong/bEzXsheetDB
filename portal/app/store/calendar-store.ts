import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface CalendarStore {
  orders: OrderListAttributes[];
  setOrders: (orders: OrderListAttributes[]) => void;
  add: (order: OrderListAttributes) => void;
  blockedTimes: OrderListAttributes[];
  setBlockedTimes: (blockedTimes: OrderListAttributes[]) => void;
  addBlockedTime: (blockedTime: OrderListAttributes) => void;
  updateBlockedTime: (blockedTime: OrderListAttributes) => void;
  removeBlockedTime: (id: string) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    immer((set) => ({
      orders: [],
      blockedTimes: [],
      setOrders: (orders) => {
        set({ orders });
      },
      add: () => {
        console.log(set);
      },
      setBlockedTimes: (blockedTimes) => {
        set({ blockedTimes });
      },
      addBlockedTime: (blockedTime) => {
        set((state) => {
          if (!state.blockedTimes) {
            state.blockedTimes = [];
          }
          state.blockedTimes.push(blockedTime);
        });
      },
      updateBlockedTime: (blockedTime) => {
        set((state) => {
          const index = state.blockedTimes.findIndex(
            (item) => item.bulkOrderId === blockedTime.bulkOrderId
          );
          if (index !== -1) {
            state.blockedTimes[index] = blockedTime;
          }
        });
      },
      removeBlockedTime: (id) => {
        set((state) => {
          state.blockedTimes = state.blockedTimes.filter((item) => item.bulkOrderId !== id);
        });
      }
    })),
    {
      name: 'calendar-store'
    }
  )
);
