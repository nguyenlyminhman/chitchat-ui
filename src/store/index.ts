import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import chatReducer from './slices/chatSlice'
import notificationReducer from './slices/notificationSlice'
import friendReducer from './slices/friendSlice'
import usersReducer from './slices/usersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    chat: chatReducer,
    notification: notificationReducer,
    friend: friendReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;