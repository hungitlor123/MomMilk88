import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IChangePassword, IChangePasswordResponse, ILogin, ILoginResponse, IRegister, IUser } from "../../models/User";
import { toast } from "react-toastify";
import { changePasswordEndpoint, loginEndpoint, registerEndpoint } from "../api/apiConfig";
import axios from "axios";
import localStorage from "redux-persist/es/storage";

type AccountState = {
  loading: boolean;
  account: IUser | null;
  registerUser: IRegister | null;
  error: string[] | unknown;
  success: boolean;
};

const initialState: AccountState = {
  loading: false,
  account: null,
  registerUser: null,
  error: [],
  success: false,
};

export const registerUser = createAsyncThunk<IUser, Object>(
  "auth/register-user",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(registerEndpoint, data);
      toast.success("Register Successful !");
      return response.data;
    } catch (error: any) {
      toast.error('Register Failed !');
      if (error.response) {
        toast.error(error.response.data);
        return thunkAPI.rejectWithValue({
          error: error.response?.data?.errorMessages,
        });
      }
    }
  }
);

export const loginUser = createAsyncThunk<IUser, ILogin>(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(loginEndpoint, data);
      const token = response.data.accessToken;
      localStorage.setItem("suame88", token);
      localStorage.setItem("USERNAME",response.data.user.name );
      localStorage.setItem("USERADDRESS",response.data.user.address);
      localStorage.setItem("USERPHONE",response.data.user.phone );
      toast.success("Login Successful !");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk<
  ILoginResponse | null,
  string | Object
>("auth/logout-user", async (_, thunkAPI) => {
  try {
    localStorage.removeItem("suame88");
    localStorage.removeItem("customerId");
    toast.success(" Logout Successful !");
    return null;
  } catch (error: any) {
    toast.error("Logout Failed !");
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const changePassword = createAsyncThunk<IChangePasswordResponse, IChangePassword>(
  "auth/changePassword",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem('suame88');
      const response = await axios.put(changePasswordEndpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      toast.error('Register Failed !');
      if (error.response) {
        toast.error('Register Failed !');
        return thunkAPI.rejectWithValue({
          error: error.response?.data?.errorMessages,
        });
      }
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setError: (state) => {
      state.error = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.account = action.payload;
      state.success = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.account = action.payload;
      state.success = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.account = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setError } = authSlice.actions;
export default authSlice.reducer;
