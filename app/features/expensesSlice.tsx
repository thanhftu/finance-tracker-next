import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Expense } from '@/app/models'
import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { Income } from '@/app/models'

const initialState = {
  expenses: [],
  loading: false,
}

export const getExpenses = createAsyncThunk(
  'expenses/getexpenses',
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const collectionRef = collection(db, 'expenses')
      const docSnap = await getDocs(collectionRef)
      const data = docSnap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      })

      return data
    } catch (error) {
      console.log(error)
    }
  }
)

export const addExpenseItem = createAsyncThunk(
  'expenses/updateexpenseitem',
  async (payload: Expense, { rejectWithValue, getState, dispatch }) => {
    try {
      const docRef = doc(db, 'expenses', payload.id)
      await updateDoc(docRef, { ...payload })

      return payload
    } catch (error) {
      console.log(error)
    }
  }
)

export const addExpenseCatgory = createAsyncThunk(
  'expenses/addexpensecategory',
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const collectionRef = collection(db, 'expenses')
      const docSnap = await addDoc(collectionRef, { ...payload, items: [] })

      return { id: docSnap.id, ...payload }
    } catch (error) {
      console.log(error)
    }
  }
)

const expensesSlice = createSlice({
  name: 'incomes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getExpenses.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getExpenses.fulfilled, (state, action) => {
      state.loading = false
      state.expenses = action.payload!
    })
    builder.addCase(getExpenses.rejected, (state, action) => {
      state.loading = false
      console.log(action.payload)
    })
    // add expense item
    builder.addCase(addExpenseItem.pending, (state) => {
      state.loading = true
    })
    builder.addCase(addExpenseItem.fulfilled, (state, action) => {
      state.loading = false

      state.expenses = state.expenses.map((expense) =>
        expense.id === action.payload.id ? action.payload : expense
      )
    })
    builder.addCase(addExpenseItem.rejected, (state, action) => {
      state.loading = false
      console.log(action.payload)
    })

    // add expense category
    builder.addCase(addExpenseCatgory.pending, (state) => {
      state.loading = true
    })
    builder.addCase(addExpenseCatgory.fulfilled, (state, action) => {
      state.loading = false

      state.expenses = [action.payload, ...state.expenses]
    })
    builder.addCase(addExpenseCatgory.rejected, (state, action) => {
      state.loading = false
      console.log(action.payload)
    })
  },
})

const expenseReducer = expensesSlice.reducer
export default expenseReducer
