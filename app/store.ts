import { configureStore } from '@reduxjs/toolkit'
import incomeReducer from './features/incomeSlice'

const store = configureStore({
  reducer: {
    incomes: incomeReducer,
  },
})
export type AppDispatch = typeof store.dispatch
export default store
