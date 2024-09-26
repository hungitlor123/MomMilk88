interface ICustomer {
    id: string;
    username: string;
    phone: string;
    name: string;
    address: string;
    avatarUrl: string | null;
    rank: string;
    status: boolean;
}

interface IProduct {
    id: number;
    name: string;
    origin: string;
    brand: string;
    ingredient: string;
    sweetLevel: string;
    flavour: string;
    sample: any;
    capacity: string;
    description: string;
    price: number;
    quantity: number;
    expireAt: string;
    createAt: string;
    status: string;
    productImages: any[];
}

export interface IFeedback {
    id: string;
    product: IProduct;
    message: string;
    star: number;
    customer: ICustomer;
    productId: string;
}

export interface IFeedbackCreate {
    star: number;
    message: string;
    productId: string;
}