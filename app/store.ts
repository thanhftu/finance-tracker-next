import { configureStore } from '@reduxjs/toolkit'
import incomeReducer from './features/incomeSlice'
import expenseReducer from './features/expensesSlice'

const store = configureStore({
  reducer: {
    incomes: incomeReducer,
    expenses: expenseReducer,
  },
})
export type AppDispatch = typeof store.dispatch
export default store
