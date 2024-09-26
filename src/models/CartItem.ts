import { IProduct } from "./Produdct";

export interface ICartItem extends IProduct {
    cartId: number;
    name: string;
    quantity: number;
    price: number;
    image: string
}