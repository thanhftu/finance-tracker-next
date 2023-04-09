'use client'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { auth } from '@/lib/firebase'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { db } from '@/lib/firebase'
import userState from '@/lib/firebase/userState'

interface User {
  authUser: null
  loading: boolean
}

const initialState = {
  authUser: null,
  loading: false,
}

export const googleLoginHandler = createAsyncThunk(
  'user/loginuser',
  async (payload, { rejectWithValue, getState, dispatch }) => {
    // const [user, loading] = useAuthState(auth)
    const googleProvider = new GoogleAuthProvider()
    try {
      // signInWithPopup(auth, googleProvider)
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      console.log(error)
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => (state.authUser = action.payload),
  },
  extraReducers: (builder) => {
    builder.addCase(googleLoginHandler.pending, (state) => {
      state.loading = true
    })
    builder.addCase(googleLoginHandler.fulfilled, (state, action) => {
      state.loading = false
      state.authUser = action.payload
    })
    builder.addCase(googleLoginHandler.rejected, (state, action) => {
      state.loading = false
    })
  },
})

const userReducer = usersSlice.reducer
export const { setUser } = usersSlice.actions
export default userReducer
