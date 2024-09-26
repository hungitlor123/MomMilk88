import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUserInfo } from '../../models/User';
import axios from 'axios';
import { getUserProfileEndpoint } from '../api/apiConfig';
import instance from '../api/customAxios';

interface CartItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface UserState {
    loading: boolean;
    user: IUserInfo | null;
    users: IUserInfo[] | null;
    cart: CartItem[] | null;
    error: string | null;
}

const initialState: UserState = {
    loading: false,
    user: null,
    users: null,
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    error: null,
};

export const getUserProfile = createAsyncThunk<IUserInfo, void>(
    'users/getUserProfile',
    async (_, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('suame88');
            const response = await axios.get(
                `${getUserProfileEndpoint}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.errorMessages || 'Unknown error',
            );
        }
    },
);

export const getAllUser = createAsyncThunk<any, { role: string, params: { pageNumber: number, pageSize: number } }>(
    'users/getAllUser',
    async (arg) => await instance.post(`/Accounts/${arg.role}s/filter`, { params: arg.params })
        .then(res => res.data.data)
        .catch(err => console.log(err))
);

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setError: (state, action) => {
            state.error = action.payload;
        },
        setCart: (state, action) => {
            state.cart = action.payload;
            localStorage.setItem('cart', JSON.stringify(action.payload));
        },
        clearCart: (state) => {
            state.cart = [];
            localStorage.removeItem('cart');
        },
        assignCartToUser: (state, action) => {
            if (state.user && state.user.id !== action.payload.id) {
                state.cart = [];
                localStorage.removeItem('cart');
            }
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUserProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
            state.cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Assign cart to user
        });
        builder.addCase(getUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(getAllUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
            state.error = null;
        });
        builder.addCase(getAllUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setError, setCart, clearCart, assignCartToUser } = usersSlice.actions;
export default usersSlice.reducer;
