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
  query,
  where,
} from 'firebase/firestore'
import { useSelector } from 'react-redux'

interface initialStateExpense {
  expenses: Expense[]
  loading: boolean
  currentExpense: Expense
}
const initialState: initialStateExpense = {
  expenses: [],
  loading: false,
  currentExpense: {
    id: '',
    color: '',
    title: '',
    total: 0,
    items: [],
  },
}

export const getExpenses = createAsyncThunk(
  'expenses/getexpenses',
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const collectionRef = collection(db, 'expenses')
      const q = query(collectionRef, where('uid', '==', payload))
      const docSnap = await getDocs(q)
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

export const updateExpenseItem = createAsyncThunk(
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
      const docSnap = await addDoc(collectionRef, {
        uid: user.uid,
        ...payload,
        items: [],
      })

      return { id: docSnap.id, ...payload, items: [] }
    } catch (error) {
      console.log(error)
    }
  }
)

export const deleteExpenses = createAsyncThunk(
  'expenses/deleteexpenses',
  async (id: string, { rejectWithValue, getState, dispatch }) => {
    try {
      const collectionRef = doc(db, 'expenses', id)
      await deleteDoc(collectionRef)
      console.log(id, 'id')
      return id
    } catch (error) {
      console.log(error)
    }
  }
)

const expensesSlice = createSlice({
  name: 'incomes',
  initialState,
  reducers: {
    setCurrentExpense: (state, action) => {
      state.currentExpense = action.payload
    },
  },
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

    // deleteexpenses
    builder.addCase(deleteExpenses.pending, (state) => {
      state.loading = true
    })
    builder.addCase(deleteExpenses.fulfilled, (state, action) => {
      state.loading = false
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      )
    })
    builder.addCase(deleteExpenses.rejected, (state, action) => {
      state.loading = false
      console.log(action.payload)
    })
    // add expense item
    builder.addCase(updateExpenseItem.pending, (state) => {
      state.loading = true
    })
    builder.addCase(updateExpenseItem.fulfilled, (state, action) => {
      state.loading = false

      state.expenses = state.expenses.map((expense) =>
        expense.id === action.payload.id ? action.payload : expense
      )
    })
    builder.addCase(updateExpenseItem.rejected, (state, action) => {
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
export const { setCurrentExpense } = expensesSlice.actions
export default expenseReducer
