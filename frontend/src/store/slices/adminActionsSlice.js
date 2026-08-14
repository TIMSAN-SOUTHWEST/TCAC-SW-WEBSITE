import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchAdmins = createAsyncThunk('adminActions/fetchAdmins', async (_, thunkAPI) => {
  try {
    const response = await api.get('/admins');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.response?.data?.error || 'An error occurred', statusCode: error.response?.status || 500 });
  }
});

export const approveAdmin = createAsyncThunk('adminActions/approveAdmin', async (adminId, thunkAPI) => {
  try {
    const response = await api.put(`/admins/${adminId}/approve`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.response?.data?.error || 'An error occurred', statusCode: error.response?.status || 500 });
  }
});

export const rejectAdmin = createAsyncThunk('adminActions/rejectAdmin', async (adminId, thunkAPI) => {
  try {
    const response = await api.put(`/admins/${adminId}/reject`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.response?.data?.error || 'An error occurred', statusCode: error.response?.status || 500 });
  }
});

export const updateAdminFunction = createAsyncThunk('adminActions/updateAdminFunction', async ({ adminId, adminFunction }, thunkAPI) => {
  try {
    const response = await api.put(`/admins/${adminId}/function`, { adminFunction });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.response?.data?.error || 'An error occurred', statusCode: error.response?.status || 500 });
  }
});

const adminActionsSlice = createSlice({
  name: 'adminActions',
  initialState: { admins: [], loading: false, error: null, approvedAdmin: null, rejectedAdmin: null },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearAdmins: (state) => { state.admins = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdmins.fulfilled, (state, action) => { state.loading = false; state.admins = action.payload; })
      .addCase(fetchAdmins.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(approveAdmin.pending, (state) => { state.loading = true; })
      .addCase(approveAdmin.fulfilled, (state, action) => { state.loading = false; state.admins = state.admins.map(admin => admin.id === action.payload.id ? action.payload : admin); })
      .addCase(approveAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(rejectAdmin.pending, (state) => { state.loading = true; })
      .addCase(rejectAdmin.fulfilled, (state, action) => { state.loading = false; state.admins = state.admins.map(admin => admin.id === action.payload.id ? action.payload : admin); })
      .addCase(rejectAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateAdminFunction.pending, (state) => { state.loading = true; })
      .addCase(updateAdminFunction.fulfilled, (state, action) => { state.loading = false; state.admins = state.admins.map(admin => admin.id === action.payload.id ? action.payload : admin); })
      .addCase(updateAdminFunction.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const selectAdmins = (state) => state.adminActions.admins;
export const selectLoading = (state) => state.adminActions.loading;
export const selectError = (state) => state.adminActions.error;
export const { clearError, clearAdmins } = adminActionsSlice.actions;
export default adminActionsSlice.reducer;
