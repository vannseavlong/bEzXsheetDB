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

/** ABA business state codes returned when HTTP status is 200 */
export type AbaPaymentState = 5000 | 1000 | 3000 | 2002 | 5001 | 16000;

export type OrderStatusResponse = {
  bulkOrderId: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN-PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  paymentStatus: 'PENDING' | 'IN-REVIEW' | 'FAILED' | 'PAID' | 'REFUNDED' | 'PARTIALLY_PAID';
  tranId: string;
  createdAt: string;
  updatedAt: string;
  /** ABA business state code: 5000=Success, 1000=Declined, 3000=InProcessing, 2002=NotFound */
  state?: AbaPaymentState;
  /** Backend hint: true means the client should retry the status check */
  shouldRetry?: boolean;
};

export type OrderCreateResponse = {
  bulkOrderId: string;
  orderId: number;
  paymentResp: PaymentResp;
};

interface PaymentResp {
  currentBalance: string;
  deductCredit: string;
  status: Status;
  description: string;
  qr_string: string;
  abapay_deeplink: string;
  checkout_qr_url: string;
  id: number;
  bulkOrderId: string;
  hash: string;
  abaHash: string;
  checkoutUrl: string;
}

interface Status {
  code: string;
  message: string;
  tran_id: string;
}
