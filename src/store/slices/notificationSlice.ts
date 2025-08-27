import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Notification {
  id: string
  content: string
  time: string
  read: boolean
  userId: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
}

const initialState: NotificationState = {
  notifications: [
    { id: '1', content: 'Tin nhắn mới từ John Doe', time: '2 phút trước', read: false, userId: '1' },
    { id: '2', content: 'Tin nhắn mới từ Jane Smith', time: '10 phút trước', read: true, userId: '2' },
    { id: '3', content: 'Tin nhắn mới từ Mike Johnson', time: '1 giờ trước', read: false, userId: '3' },
    ...Array.from({ length: 25 }, (_, i) => ({
      id: (4 + i).toString(),
      content: `Thông báo mẫu ${i + 4}`,
      time: `${i + 4} phút trước`,
      read: i % 2 === 0,
      userId: ((i % 4) + 1).toString(),
    }))
  ],
  unreadCount: 0,
  loading: false,
  error: null,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
      if (!action.payload.read) {
        state.unreadCount += 1
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
      state.unreadCount = 0
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter(n => !n.read).length
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
  },
})

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  setNotifications,
  setLoading,
  setError,
  clearNotifications,
} = notificationSlice.actions

export default notificationSlice.reducer 