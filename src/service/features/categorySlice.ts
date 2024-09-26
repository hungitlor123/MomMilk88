import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ICategory, ICategoryCreate, ICategoryRename } from '../../models/Category';
import axios from 'axios';
import { toast } from 'react-toastify';
import instance from '../api/customAxios';

type CategoryState = {
    loading: boolean;
    categories: ICategory[] | null;
    createCategory: ICategoryCreate | null;
    error: string[] | unknown;
    success: boolean;
};
const initialState: CategoryState = {
    loading: false,
    categories: null,
    createCategory: null,
    error: null,
    success: false,
};

export const getAllCategories = createAsyncThunk<void>(
    'categories/getAllCategories',
    async () => {
       
            await instance.post('/categories/filter',{name: ''}).then(response => {
                console.log(response.data.data)
                return response.data.data;
            }).catch(error => console.log(error))
       
    },
);

export const createCategory = createAsyncThunk<ICategoryCreate, Object>(
    'categories/createCategory',
    async (category, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('suame88');
            const response = await axios.post(
                '/categories',
                category,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            toast.success('Create Successfully!');
            return response.data.data;
        } catch (error: any) {
            toast.error('Create Failed!');
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);
export const updateCategory = createAsyncThunk<ICategory, ICategoryRename>(
    'categories/updateCategory',
    async ({ id, name, targetAudience, ageRange, milkType, icon }, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('suame88');
            const response = await axios.put(
                `/categories/${id}`,
                { id, name, targetAudience, ageRange, milkType, icon },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            toast.success('Update Successfully!');
            return response.data;
        } catch (error: any) {
            toast.error('Update Failed!');
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);
export const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllCategories.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllCategories.fulfilled, (state: any, action) => {
            state.loading = false;
            state.categories = action.payload;
            console.log(action.payload)
        });
        builder.addCase(getAllCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string[];
        });

        builder.addCase(createCategory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.createCategory = action.payload;
            state.success = true;
        });
        builder.addCase(createCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string[];
        });


        builder.addCase(updateCategory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateCategory.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(updateCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string[];
        });
    },
});
export const { setError } = categorySlice.actions;
export default categorySlice.reducer;
