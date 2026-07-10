// Order Creation Types
export type OrderCreateRequest = {
  paymentMethod: string;
  productOption: {
    id: number;
    qty: number;
  };
  productAddOns?: {
    id: number;
    qty: number;
  }[];
  pairOptions?: {
    id: number;
    qty: number;
  }[];
  addressId: number;
  address?: string;
  floorNum?: string;
  roomNum?: string;
  scheduleStartDate: string;
  note?: string;
  couponCode?: string;
};

export type OrderCreateResponse = {
  bulkOrderId: string;
  orderId: number;
};
