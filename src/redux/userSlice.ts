import {API_URL} from '@/config/api';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KEY_TOKEN, KEY_USER} from '@/constants/key';
import {getHeader} from '@/config/header';
import { ImageUploadData, UserState } from '@/utils/types';


// Initial state
const initialState: UserState = {
  token: null,
  user: null,
  info: null,
  users: null,
  avatar: null,
  status: 'idle',
  error: null,
};

const serializeError = (error: any) => {
  return (
    error.response?.data?.message || error.message || 'Something went wrong'
  );
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: any, {rejectWithValue}) => {
    try {
      const response = await axios.post(`${API_URL}/user/signup`, data);
      console.log('response: ', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(serializeError(error));
      // throw new Error('register failed', error.message);
    }
  },
);
export const login = createAsyncThunk(
  'user/login',
  async (data: any, {rejectWithValue}) => {
    try {
      const response = await axios.post(`${API_URL}/user/login`, data);
      const token = response.data.message.metadata.tokens;
      const user = response.data.message.metadata.user;

      await AsyncStorage.setItem(KEY_TOKEN, JSON.stringify(token.accessToken));
      await AsyncStorage.setItem(KEY_USER, JSON.stringify(user));

      return response.data.message.metadata;
    } catch (error: any) {
      return rejectWithValue(serializeError(error));
    }
  },
);
export const verifyOTP = createAsyncThunk(
  'user/verify-email',
  async (data: any, {rejectWithValue}) => {
    try {
      console.log('data', data);
      const response = await axios.post(`${API_URL}/user/verify-email`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(serializeError(error));
    }
  },
);
export const resendOTP = createAsyncThunk(
  'user/resend-otp',
  async (data: any, {rejectWithValue}) => {
    try {
      const {email} = data;
      console.log('data', data);
      const response = await axios.post(`${API_URL}/user/resend-email`, {
        email,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(serializeError(error));
    }
  },
);
export const getUser = createAsyncThunk(
  'user/get-user',
  async (_, {rejectWithValue}) => {
    try {
      const headers = await getHeader();
      if (!headers) {
        throw new Error('Failed to get headers');
      }

      const response = await axios.get(`${API_URL}/user/get-info`, {headers});
      return response.data.message.metadata;
    } catch (error: any) {
      return rejectWithValue(serializeError(error));
    }
  },
);
export const showAvatar = createAsyncThunk(
  'user/get-avatar',
  async (_, {rejectWithValue}) => {
    try {
      const headers = await getHeader();
      if (!headers) {
        throw new Error('Failed to get headers');
      }

      const response = await axios.get(`${API_URL}/avartar/user/show-avatar`, {
        headers,
      });
      return response.data.message.metadata;
    } catch (error: any) {
      return rejectWithValue(serializeError(error));
    }
  },
);
export const uploadAvatar = createAsyncThunk(
  'user/avatar-upload',
  async (imageData: ImageUploadData, {rejectWithValue}) => {
    try {
      const headers = await getHeader();
      if (!headers) {
        throw new Error('Failed to get headers');
      }

      const formData = new FormData();
      formData.append('images', {
        uri: imageData.uri,
        type: imageData.type,
        name: imageData.name,
      } as any);

      const response = await axios.post(
        `${API_URL}/avartar/user/upload`,
        formData, // Send formData directly, not wrapped in an object
        {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data.message.metadata;
    } catch (error: any) {
      return rejectWithValue(serializeError(error));
    }
  },
);

const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(login.pending, state => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // state.token = action.payload;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(verifyOTP.pending, state => {
        state.status = 'loading';
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to resend OTP';
      })
      .addCase(resendOTP.pending, state => {
        state.status = 'loading';
      })
      .addCase(resendOTP.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to resend OTP';
      })
      .addCase(getUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.info = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to resend OTP';
      })
      .addCase(showAvatar.pending, state => {
        state.status = 'loading';
      })
      .addCase(showAvatar.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.avatar = action.payload;
        state.error = null;
      })
      .addCase(showAvatar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to resend OTP';
      });
  },
});

export default usersSlice.reducer;
