import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'multiple'
  fileUrl?: string
  fileName?: string
  fileSize?: number
  files?: Array<{
    url: string
    name: string
    size: number
    type: string
  }>
}

export interface OnlineUser {
  id: string
  username: string
  lastSeen: Date
}

interface ChatState {
  messages: Message[]
  selectedUser: OnlineUser | null
  onlineUsers: OnlineUser[]
  loading: boolean
  error: string | null
}

const initialState: ChatState = {
  messages: [],
  selectedUser: null,
  onlineUsers: [
    { id: '1', username: 'John Doe', lastSeen: new Date() },
    { id: '2', username: 'Jane Smith', lastSeen: new Date() },
    { id: '3', username: 'Mike Johnson', lastSeen: new Date() },
    { id: '4', username: 'Sarah Williams', lastSeen: new Date() },
  ],
  loading: false,
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<OnlineUser | null>) => {
      state.selectedUser = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload
    },
    setOnlineUsers: (state, action: PayloadAction<OnlineUser[]>) => {
      state.onlineUsers = action.payload
    },
    addOnlineUser: (state, action: PayloadAction<OnlineUser>) => {
      state.onlineUsers.push(action.payload)
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(user => user.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
  },
})

export const {
  setSelectedUser,
  addMessage,
  setMessages,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setLoading,
  setError,
  clearMessages,
} = chatSlice.actions

export default chatSlice.reducer 