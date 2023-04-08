import React, { useState } from 'react'
import { currencyFormatter } from '@/lib/utils'
import ViewExpenseModal from './modals/ViewExpenseModal'
import { Expense } from '@/app/models'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentExpense } from '@/app/features/expensesSlice'

interface Props {
  amount: number
  title: string
  color: string
  expense: Expense
}
function ExpenseCategoryItem({ amount, title, color, expense }: Props) {
  const [showViewExpense, SetShowViewExpense] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.users)
  const { currentExpense } = useSelector((state) => state.expenses)
  // console.log(currentExpense, 'current')
  const expenseHistoryHandler = () => {
    dispatch(setCurrentExpense(expense))
    SetShowViewExpense(true)
  }

  return (
    <>
      <ViewExpenseModal
        show={showViewExpense}
        onClose={SetShowViewExpense}
        expense={expense}
        title={title}
      />
      <button onClick={expenseHistoryHandler}>
        <div className="flex justify-between items-center px-4 py-4 bg-slate-700 rounded-3xl">
          <div className="flex items-center gap-2">
            <div
              className="w-[25px] h-[25px] rounded-full "
              style={{ backgroundColor: color }}
            />
            <h4>{title}</h4>
          </div>
          <p>{currencyFormatter('USD', amount)}</p>
        </div>
      </button>
    </>
  )
}

export default ExpenseCategoryItem
