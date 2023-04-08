import React, { Dispatch, SetStateAction, useRef, useEffect } from 'react'

import Modal from '../Modal'
import { FaRegTrashAlt } from 'react-icons/fa'
import { currencyFormatter } from '@/lib/utils'
import { useSelector, useDispatch } from 'react-redux'
import {
  deleteExpenses,
  setCurrentExpense,
  updateExpenseItem,
} from '@/app/features/expensesSlice'

interface Props {
  show: boolean
  onClose: Dispatch<SetStateAction<boolean>>

  title: string
}

function ViewExpenseModal({ show, onClose, title }: Props) {
  const { currentExpense } = useSelector((state) => state.expenses)
  // console.log(currentExpense, 'new current')
  const dispatch = useDispatch()

  const deleteExpenseItemHandler = async (itemID: string, amount: number) => {
    const newItems = currentExpense.items.filter((i) => i.id !== itemID)
    const newTotal = currentExpense.total - amount
    const newCurrentExpense = {
      ...currentExpense,
      total: newTotal,
      items: [...newItems],
    }
    dispatch(setCurrentExpense(newCurrentExpense))
    dispatch(updateExpenseItem(newCurrentExpense))
    // console.log(newItems, 'newItem')
  }
  const deleteExpenseCategoryHandler = async () => {
    console.log(currentExpense.id, 'id')
    await dispatch(deleteExpenses(currentExpense.id))
  }
  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h3>{title}</h3>
        <button
          className="btn btn-danger"
          onClick={deleteExpenseCategoryHandler}
        >
          Delete
        </button>
      </div>
      <div className="mt-5">
        {currentExpense.items.map((item) => (
          <div className="flex items-center justify-between">
            <small>
              {item.createdAt.toMillis()
                ? new Date(item.createdAt.toMillis()).toISOString()
                : item.createdAt.toISOString()}
            </small>
            <div className="flex items-center gap-2">
              <p>{currencyFormatter('USD', item.amount)}</p>
              <button
                onClick={() => deleteExpenseItemHandler(item.id, item.amount)}
              >
                <FaRegTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default ViewExpenseModal
