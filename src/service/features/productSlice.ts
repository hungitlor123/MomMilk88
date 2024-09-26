import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { createProductEndpoint, getAllProductsEndpoint, getProductByIdEndpoint } from "../api/apiConfig";
import { IProduct, IProductCreate } from "../../models/Produdct";
import { toast } from "react-toastify";
import { ICartItem } from "../../models/CartItem";
import axios from "../api/customAxios";
// import instance from "../api/customAxios";

const loadCartFromStorage = (): ICartItem[] | null => {
    const cartString = localStorage.getItem('cart');
    if (cartString) {
        try {
            return JSON.parse(cartString);
        } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
        }
    }
    return null;
};

type ProductState = {
    loading: boolean;
    products: IProduct[] | null;
    product: IProduct | null;
    createProduct: IProductCreate | null;
    cart: ICartItem[] | null;
    error: string | unknown;
    success: boolean;
};

const initialState: ProductState = {
    loading: false,
    products: null,
    product: null,
    createProduct: null,
    cart: loadCartFromStorage(),
    error: null,
    success: false,
};

export const getAllProducts = createAsyncThunk<IProduct[], { text?: string | null; category?: string | null }>(
    'products/getAllProducts',
    async ({ text, category }, thunkAPI) => {
        try {
            const response = await axios.post('/products/filter?pageNumber=0&pageSize=100', {
                search: text || '',
                categoryId: category || ''
            });
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const getProductById = createAsyncThunk<IProduct, { id: string }>(
    'products/getProductById',
    async (data, thunkAPI) => {
        const { id } = data;
        try {
            const response = await axios.get(`/products/${id}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.errorMessages || 'Unknown error',
            );
        }
    },
);

export const createProduct = createAsyncThunk<IProductCreate, FormData>(
    'products/createProduct',
    async (product, thunkAPI) => {
        try {
            const response = await axios.post(
                '/products',
                product
            );
            return response.data.data;
        } catch (error: any) {
            toast.error('Create Failed!');
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

// // Define a function to save cart to localStorage
// const saveCartToStorage = (cart: ICartItem[] | null) => {
//     if (cart) {
//         localStorage.setItem('cart', JSON.stringify(cart));
//     } else {
//         localStorage.removeItem('cart');
//     }
// };

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string | unknown>) => {
            state.error = action.payload;
        },
        addToCart: (state, action: PayloadAction<ICartItem>) => {
            const productToAdd = action.payload;

            if (state.cart) {
                const existingCartItem = state.cart.find(item => item.id === productToAdd.id);

                if (existingCartItem) {
                    existingCartItem.quantity += productToAdd.quantity; // Cập nhật số lượng hiện tại với số lượng mới
                } else {
                    const newCartItem: ICartItem = {
                        ...productToAdd,
                        cartId: state.cart.length + 1,
                    };
                    state.cart.push(newCartItem);
                }
            } else {
                state.cart = [{
                    ...productToAdd,
                    cartId: 1,
                }];
            }
            // lưu local storage
            // saveCartToStorage(state.cart);
        },
        removeCart:(state) =>{
           state.cart = [];

        },
        increaseQuantity: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            if (state.cart) {
                const cartItem = state.cart.find(item => item.id === productId);
                if (cartItem) {
                    cartItem.quantity += 1;
                    // saveCartToStorage(state.cart);
                }
            }
        },
        decreaseQuantity: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            if (state.cart) {
                const cartItemIndex = state.cart.findIndex(item => item.id === productId);
                if (cartItemIndex !== -1) {
                    const cartItem = state.cart[cartItemIndex];
                    if (cartItem.quantity > 1) {
                        cartItem.quantity -= 1;
                    } else {
                        state.cart.splice(cartItemIndex, 1);
                    }
                    // saveCartToStorage(state.cart);
                }
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            if (state.cart) {
                const cartItemIndex = state.cart.findIndex(item => item.id === productId);
                if (cartItemIndex !== -1) {
                    state.cart.splice(cartItemIndex, 1);
                    // saveCartToStorage(state.cart);
                }
            }
        },
        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const { id, quantity } = action.payload;
            if (state.cart) {
                const cartItem = state.cart.find(item => item.id === id);
                if (cartItem) {
                    cartItem.quantity = quantity;
                    // saveCartToStorage(state.cart);
                }
            }
        },
        resetProduct: (state) => {
            state.product = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllProducts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        });
        builder.addCase(getAllProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(getProductById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getProductById.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload;
        });
        builder.addCase(getProductById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(createProduct.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.createProduct = action.payload;
            state.success = true;
        });
        builder.addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { setError, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, updateQuantity, resetProduct, removeCart } = productSlice.actions;
export default productSlice.reducer;
