import { configureStore } from '@reduxjs/toolkit'
import incomeReducer from './features/incomeSlice'
import expenseReducer from './features/expensesSlice'
import userReducer from './features/usersSlice'

const store = configureStore({
  reducer: {
    incomes: incomeReducer,
    expenses: expenseReducer,
    users: userReducer,
  },
})
export type AppDispatch = typeof store.dispatch
export default store
