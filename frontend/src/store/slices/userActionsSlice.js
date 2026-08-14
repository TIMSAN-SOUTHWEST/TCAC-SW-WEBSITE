import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchUsers = createAsyncThunk("userActions/fetchUsers", async (_, thunkAPI) => {
  try {
    const response = await api.get("/users");
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.response?.data?.message || "An error occurred", statusCode: error.response?.status || 500 });
  }
});

export const approveUser = createAsyncThunk("userActions/approveUser", async (userId, thunkAPI) => {
  try {
    const response = await api.put(`/users/${userId}/approve`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.response?.data?.message || "An error occurred", statusCode: error.response?.status || 500 });
  }
});

export const rejectUser = createAsyncThunk("userActions/rejectUser", async (userId, thunkAPI) => {
  try {
    const response = await api.put(`/users/${userId}/reject`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.response?.data?.message || "An error occurred", statusCode: error.response?.status || 500 });
  }
});

const userActionsSlice = createSlice({
  name: "userActions",
  initialState: { users: [], loading: false, error: null, approvedUser: null, rejectedUser: null },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearUsers: (state) => { state.users = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(approveUser.pending, (state) => { state.loading = true; })
      .addCase(approveUser.fulfilled, (state, action) => { state.loading = false; state.approvedUser = action.payload; state.users = state.users.map((user) => user.id === action.payload.id ? action.payload : user); })
      .addCase(approveUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(rejectUser.pending, (state) => { state.loading = true; })
      .addCase(rejectUser.fulfilled, (state, action) => { state.loading = false; state.rejectedUser = action.payload; state.users = state.users.map((user) => user.id === action.payload.id ? action.payload : user); })
      .addCase(rejectUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const selectUsers = (state) => state.userActions.users;
export const selectLoading = (state) => state.userActions.loading;
export const selectError = (state) => state.userActions.error;
export const { clearError, clearUsers } = userActionsSlice.actions;
export default userActionsSlice.reducer;
