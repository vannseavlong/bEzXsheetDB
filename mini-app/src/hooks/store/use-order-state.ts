import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';

enableMapSet();

export type ServiceAddon = {
  id: string;
  qty: number;
};

type ServiceSelections = {
  selectedServiceId: string | null;
  selectedProductId: string | null;
  productQuantity: number;
  selectedAddonItems: Map<string, number>;
};

type OrderItemProps = {
  productId: string;
  productAddOnIds: string[];
  serviceAddons: ServiceAddon[];
  serviceSelections: ServiceSelections;
  productQuantity: number; // Add product quantity to the global state
};

type OrderProps = {
  setPayload: (order: OrderItemProps) => void;
  setAddon: (addons: ServiceAddon[]) => void;
  setServiceSelections: (selections: ServiceSelections) => void;
  clearServiceSelections: () => void;
  resetAll: () => void; // Add a function to reset everything
} & OrderItemProps;

const useOrderState = create<OrderProps>()(
  immer((set) => ({
    productId: '',
    productAddOnIds: [],
    serviceAddons: [],
    productQuantity: 0,
    serviceSelections: {
      selectedServiceId: null,
      selectedProductId: null,
      productQuantity: 0,
      selectedAddonItems: new Map()
    },
    setPayload: (order: OrderItemProps) => {
      set((state) => {
        state.productId = order.productId;
        state.productAddOnIds = order.productAddOnIds;
        state.productQuantity = order.productQuantity;
      });
    },
    setAddon: (services: ServiceAddon[]) => {
      set((state) => {
        state.serviceAddons = services;
      });
    },
    setServiceSelections: (selections: ServiceSelections) => {
      set((state) => {
        state.serviceSelections = selections;
        state.productQuantity = selections.productQuantity; // Also update the top-level productQuantity
      });
    },
    clearServiceSelections: () => {
      set((state) => {
        state.serviceSelections = {
          selectedServiceId: null,
          selectedProductId: null,
          productQuantity: 0,
          selectedAddonItems: new Map()
        };
        state.productQuantity = 0;
      });
    },
    resetAll: () => {
      set((state) => {
        state.productId = '';
        state.productAddOnIds = [];
        state.serviceAddons = [];
        state.productQuantity = 0;
        state.serviceSelections = {
          selectedServiceId: null,
          selectedProductId: null,
          productQuantity: 0,
          selectedAddonItems: new Map()
        };
      });
    }
  }))
);

export default useOrderState;
