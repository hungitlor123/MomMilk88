import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { IProduct } from "../../models/Produdct"; 

interface CartItem extends IProduct {
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

// Helper function to save cart to localStorage
const saveCartToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<IProduct>) => {
            const { id, name, brand, price, ...rest } = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1; // Increase quantity if the product already exists in the cart
            } else {
                const { quantity, ...restWithoutQuantity } = rest;
                state.items.push({
                    id,
                    name,
                    brand,
                    price,
                    quantity: 1,
                    ...restWithoutQuantity,
                });
            }
            saveCartToLocalStorage(state.items); // Save to localStorage
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            state.items = state.items.filter(item => item.id !== itemId);
            saveCartToLocalStorage(state.items); // Save to localStorage
        },
        updateCartItemQuantity: (state, action: PayloadAction<{ id: string, quantity: number }>) => {
            const { id, quantity } = action.payload;
            const cartItem = state.items.find(item => item.id === id);
            if (cartItem) {
                cartItem.quantity = quantity;
            }
            saveCartToLocalStorage(state.items); // Save to localStorage
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cartItems'); // Remove from localStorage
        },
    },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;

export default cartSlice.reducer;
