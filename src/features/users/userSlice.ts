import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { User, UserState } from '@/types'
import { getApiClient } from '@/api'

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const apiClient = getApiClient()
      const users = await apiClient.getUsers()
      return users
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
    }
  }
)

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = []
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(user => user.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false
        state.users = action.payload
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'An error occurred'
      })
  },
})

export const { clearUsers, deleteUser } = userSlice.actions
export default userSlice.reducer
