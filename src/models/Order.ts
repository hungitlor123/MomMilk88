export interface Order {
    id: string;
    amount: number;
    discount: number;
    receiver: string;
    address: string;
    phone: string;
    paymentMethod: string;
    orderVouchers: { voucherId: string }[];
    orderDetails: {
      productId: string;
      quantity: number;
      price: number;
    }[];
    isPayment: boolean;
    status: string;
    createdAt: string;
    customerId: string;
  }
  
  export interface OrderFilter {
    receiver?: string;
    customerId?: string;
    phone?: string;
    isPayment?: boolean;
    status?: string;
    from?: string;
    to?: string;
  }
  