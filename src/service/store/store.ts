// Import các module cần thiết
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from '../features/authSlice';
import categorySlice from '../features/categorySlice';
import productSlice from '../features/productSlice';
import userSlice from '../features/userSlice';
import cartSlice from '../features/cartSlice';
import feedbackSlice from '../features/feedbackSlice';

// Định nghĩa cấu hình persist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: [
        'auth',
        'categories',
        'products',
        'users',
        'cart',
        'feedbacks'
    ],
};

const rootReducer = combineReducers({
    auth: authSlice,
    categories: categorySlice,
    products: productSlice,
    users: userSlice,
    cart: cartSlice,
    feedbacks: feedbackSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;