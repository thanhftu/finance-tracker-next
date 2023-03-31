import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { Income } from '@/app/models'
import { currencyFormatter } from '@/lib/utils'

const initialState = {
  incomes: [],
  loading: false,
}

export const getIncomes = createAsyncThunk(
  'incomes/getincomes',
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const collectionRef = collection(db, 'income')
      const docSnap = await getDocs(collectionRef)
      const data = docSnap.docs.map((doc) => {
        return {
          id: doc.id,
          description: doc.data().description,
          amount: doc.data().amount,
          createdAt: new Date(doc.data().createdAt.toMillis()),
        }
      })

      return data
    } catch (error) {
      console.log(error)
    }
  }
)

export const deleteIncome = createAsyncThunk(
  'incomes/deleteincome',
  async (id: string, { rejectWithValue, getState, dispatch }) => {
    try {
      const docRef = doc(db, 'income', id)
      await deleteDoc(docRef)
      return id
      // setIncome((prev) => {
      //   return prev.filter((i) => i.id !== id)
      // })
    } catch (error) {
      console.log(error)
    }
  }
)

interface Payload {
  description: string
  amount: number
  createdAt: Date
}
export const addIncome = createAsyncThunk(
  'incomes/addincome',
  async (payload: Payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const collectionRef = collection(db, 'income')
      const docSnap = await addDoc(collectionRef, payload)
      const newIncome = { id: docSnap.id, ...payload }
      return newIncome
    } catch (error) {
      console.log(error)
    }
  }
)

const incomeSlice = createSlice({
  name: 'incomes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIncomes.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getIncomes.fulfilled, (state, action) => {
      state.loading = false
      state.incomes = action.payload!
    })
    builder.addCase(getIncomes.rejected, (state, action) => {
      state.loading = false
      console.log(action.payload)
    })
    // delete income
    builder.addCase(deleteIncome.pending, (state) => {
      state.loading = true
    })
    builder.addCase(deleteIncome.fulfilled, (state, action) => {
      state.loading = false
      state.incomes = state.incomes.filter((i) => i.id !== action.payload)
    })
    builder.addCase(deleteIncome.rejected, (state, action) => {
      state.loading = false
      console.log(action.payload)
    })
    // add income
    builder.addCase(addIncome.pending, (state) => {
      state.loading = true
    })
    builder.addCase(addIncome.fulfilled, (state, action) => {
      state.loading = false
      state.incomes = [action.payload!, ...state.incomes]
    })
    builder.addCase(addIncome.rejected, (state, action) => {
      state.loading = false
      console.log(action.payload)
    })
  },
})

const incomeReducer = incomeSlice.reducer
export default incomeReducer
