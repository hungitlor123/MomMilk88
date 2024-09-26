import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IFeedback, IFeedbackCreate } from "../../models/Feedback";
import axios from "axios";
import { createFeedbackEndpoint, getFeedbackByProductId } from "../api/apiConfig";
import { toast } from "react-toastify";

type FeedbackState = {
    loading: boolean;
    feedbacks: IFeedback[] | null;
    createFeedback: IFeedback | null;
    error: string | unknown;
    success: boolean;
};

const initialState: FeedbackState = {
    loading: false,
    feedbacks: null,
    createFeedback: null,
    error: null,
    success: false,
};

export const getAllFeedbacksByProductId = createAsyncThunk<IFeedback[], {id: string}>(
    'feedbacks/getAllFeedbacksByProductId',
    async (arg, thunkAPI) => {
        try {
            const token = localStorage.getItem('suame88');
            const response = await axios.post(`${getFeedbackByProductId}/${arg.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createFeedbackByProductId = createAsyncThunk<IFeedback, IFeedbackCreate>(
    'feedbacks/createFeedbackByProductId',
    async (feedback, thunkAPI) => {
        try {
            const token = localStorage.getItem('suame88');
            const response = await axios.post(
                createFeedbackEndpoint,
                feedback,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            toast.success('Feedback Successfully!');
            return response.data.data;
        } catch (error: any) {
            toast.error(error.response.data);
            // console.log(error.response.body);            
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const feedbackSlice = createSlice({
    name: 'feedbacks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllFeedbacksByProductId.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllFeedbacksByProductId.fulfilled, (state, action) => {
            state.loading = false;
            state.feedbacks = action.payload;
        });
        builder.addCase(getAllFeedbacksByProductId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(createFeedbackByProductId.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createFeedbackByProductId.fulfilled, (state, action) => {
            state.loading = false;
            state.createFeedback = action.payload;
            state.success = true;
        });
        builder.addCase(createFeedbackByProductId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default feedbackSlice.reducer;
