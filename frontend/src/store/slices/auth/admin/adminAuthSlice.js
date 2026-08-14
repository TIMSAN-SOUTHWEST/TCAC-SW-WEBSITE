import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import api from '../../../../utils/api';

export const registerAdmin = createAsyncThunk('admin/registerAdmin', async (formValues, thunkAPI) => {
  try {
    const response = await api.post('/auth/admin/register', formValues);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.response?.data?.error || 'Registration failed', statusCode: error.response?.status || 500 });
  }
});

export const loginAdmin = createAsyncThunk('admin/login', async (formValues, thunkAPI) => {
  try {
    const response = await api.post('/auth/admin/login', formValues);
    localStorage.setItem('adminToken', response.data.token);
    return { admin: response.data.adminData, token: response.data.token };
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.response?.data?.error || 'Login failed', statusCode: error.response?.status || 500 });
  }
});

export const sendResetCode = createAsyncThunk('admin/sendResetCode', async ({ email }, thunkAPI) => {
  try {
    const response = await api.post('/auth/admin/send-reset-code', { email });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.response?.data?.message || 'Failed to send reset code', statusCode: error.response?.status || 500 });
  }
});

export const verifyResetCodeAndChangePassword = createAsyncThunk('admin/verifyResetCodeAndChangePassword', async ({ email, code, password }, thunkAPI) => {
  try {
    const response = await api.post('/auth/admin/verify-reset-code', { email, code, password });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue({ message: error.response?.data?.message || 'Failed to reset password', statusCode: error.response?.status || 500 });
  }
});

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    admin: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null,
    loading: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    logoutAdmin: (state) => { state.admin = null; state.token = null; localStorage.removeItem('adminToken'); sessionStorage.removeItem('adminData'); },
    setAdmin: (state, action) => { state.admin = action.payload; state.token = localStorage.getItem('adminToken'); },
    clearStatus: (state) => { state.status = 'idle'; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => { if (action.payload.adminAuth) { state.admin = action.payload.adminAuth.admin; state.token = action.payload.adminAuth.token; } })
      .addCase(registerAdmin.pending, (state) => { state.loading = true; state.status = 'pending'; })
      .addCase(registerAdmin.fulfilled, (state, action) => { state.loading = false; state.status = 'succeeded'; state.admin = action.payload; })
      .addCase(registerAdmin.rejected, (state, action) => { state.loading = false; state.status = 'failed'; state.error = action.payload; })
      .addCase(loginAdmin.pending, (state) => { state.loading = true; state.status = 'pending'; })
      .addCase(loginAdmin.fulfilled, (state, action) => { state.loading = false; state.status = 'succeeded'; state.admin = action.payload.admin; state.token = action.payload.token; })
      .addCase(loginAdmin.rejected, (state, action) => { state.loading = false; state.status = 'failed'; state.error = action.payload; })
      .addCase(sendResetCode.pending, (state) => { state.loading = true; state.status = 'pending'; })
      .addCase(sendResetCode.fulfilled, (state) => { state.loading = false; state.status = 'succeeded'; })
      .addCase(sendResetCode.rejected, (state, action) => { state.loading = false; state.status = 'failed'; state.error = action.payload; })
      .addCase(verifyResetCodeAndChangePassword.pending, (state) => { state.loading = true; state.status = 'pending'; })
      .addCase(verifyResetCodeAndChangePassword.fulfilled, (state) => { state.loading = false; state.status = 'succeeded'; })
      .addCase(verifyResetCodeAndChangePassword.rejected, (state, action) => { state.loading = false; state.status = 'failed'; state.error = action.payload; });
  },
});

export const { logoutAdmin, setAdmin, clearStatus } = adminAuthSlice.actions;
export const selectAuthLoading = (state) => state.adminAuth.loading;
export const selectAuthStatus = (state) => state.adminAuth.status;
export const selectAuthError = (state) => state.adminAuth.error;
export const selectAdmin = (state) => state.adminAuth.admin;
export const selectAdminToken = (state) => state.adminAuth.token;
export const selectIsAdminAuthenticated = (state) => !!state.adminAuth.token;
export default adminAuthSlice.reducer;
