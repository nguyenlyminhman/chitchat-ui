import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '@/services/ApiClient';

const api = new ApiClient("https://jsonplaceholder.typicode.com");

const TYPE = {
  FETCH_USERS: 'users/fetch',
  USERS_REGISTER: 'users/register',

}

export const fetchUsers = createAsyncThunk(
  TYPE.FETCH_USERS,
  async () => {
    const res = api.getWithoutAuth<any>("/users")
    return res;
  }
);



export const registerUser = createAsyncThunk(
  TYPE.USERS_REGISTER,
  async (params: userData) => {    
    const res = api.postWithoutAuth<any>("/register", params);
    return res;
  }
);


export interface UsersState {
  data: any[];
  loading: boolean;
  error: string | null;
  registerLoading: boolean;
  registerError: string | null;
}

export interface userData  {
    username: string;
    email: string;
    password: string;
}

const initialState: UsersState = {
  data: [],
  loading: false,
  error: null,
  registerLoading: false,
  registerError: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers cases
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
  }
});


export default usersSlice.reducer;