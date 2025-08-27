import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FriendSuggestion {
  id: string
  name: string
  mutual: number
}

export interface BlockedUser {
  id: string
  name: string
}

export interface InvitedUser {
  id: string
  name: string
}

export interface ReceivedRequest {
  id: string
  name: string
}

interface FriendState {
  suggestions: FriendSuggestion[]
  blocked: BlockedUser[]
  invited: InvitedUser[]
  received: ReceivedRequest[]
  loading: boolean
  error: string | null
}

const initialState: FriendState = {
  suggestions: [
    { id: '1', name: 'Alice', mutual: 2 },
    { id: '2', name: 'Bob', mutual: 1 },
    { id: '3', name: 'Charlie', mutual: 0 },
    ...Array.from({ length: 20 }, (_, i) => ({
      id: (4 + i).toString(),
      name: `Friend Suggestion ${i + 4}`,
      mutual: i % 5,
    }))
  ],
  blocked: [
    { id: '4', name: 'Eve' },
    { id: '5', name: 'Mallory' },
    ...Array.from({ length: 12 }, (_, i) => ({
      id: (6 + i).toString(),
      name: `Blocked User ${i + 6}`
    }))
  ],
  invited: [
    { id: '6', name: 'Trent' },
    { id: '7', name: 'Oscar' },
    ...Array.from({ length: 15 }, (_, i) => ({
      id: (8 + i).toString(),
      name: `Invited User ${i + 8}`
    }))
  ],
  received: [
    { id: '100', name: 'User Request 1' },
    { id: '101', name: 'User Request 2' },
    { id: '102', name: 'User Request 3' },
    ...Array.from({ length: 8 }, (_, i) => ({
      id: (110 + i).toString(),
      name: `User Request ${i + 4}`
    }))
  ],
  loading: false,
  error: null,
}

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    addSuggestion: (state, action: PayloadAction<FriendSuggestion>) => {
      state.suggestions.push(action.payload)
    },
    removeSuggestion: (state, action: PayloadAction<string>) => {
      state.suggestions = state.suggestions.filter(s => s.id !== action.payload)
    },
    addBlockedUser: (state, action: PayloadAction<BlockedUser>) => {
      state.blocked.push(action.payload)
    },
    removeBlockedUser: (state, action: PayloadAction<string>) => {
      state.blocked = state.blocked.filter(u => u.id !== action.payload)
    },
    addInvitedUser: (state, action: PayloadAction<InvitedUser>) => {
      state.invited.push(action.payload)
    },
    removeInvitedUser: (state, action: PayloadAction<string>) => {
      state.invited = state.invited.filter(u => u.id !== action.payload)
    },
    addReceivedRequest: (state, action: PayloadAction<ReceivedRequest>) => {
      state.received.push(action.payload)
    },
    removeReceivedRequest: (state, action: PayloadAction<string>) => {
      state.received = state.received.filter(r => r.id !== action.payload)
    },
    setSuggestions: (state, action: PayloadAction<FriendSuggestion[]>) => {
      state.suggestions = action.payload
    },
    setBlockedUsers: (state, action: PayloadAction<BlockedUser[]>) => {
      state.blocked = action.payload
    },
    setInvitedUsers: (state, action: PayloadAction<InvitedUser[]>) => {
      state.invited = action.payload
    },
    setReceivedRequests: (state, action: PayloadAction<ReceivedRequest[]>) => {
      state.received = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearAll: (state) => {
      state.suggestions = []
      state.blocked = []
      state.invited = []
      state.received = []
    },
  },
})

export const {
  addSuggestion,
  removeSuggestion,
  addBlockedUser,
  removeBlockedUser,
  addInvitedUser,
  removeInvitedUser,
  addReceivedRequest,
  removeReceivedRequest,
  setSuggestions,
  setBlockedUsers,
  setInvitedUsers,
  setReceivedRequests,
  setLoading,
  setError,
  clearAll,
} = friendSlice.actions

export default friendSlice.reducer 