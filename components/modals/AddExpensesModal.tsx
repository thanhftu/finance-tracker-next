'use client'
import React, { Dispatch, SetStateAction, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../Modal'
import { Expense } from '@/app/models'

import { v4 as uuidv4 } from 'uuid'
import {
  addExpenseCatgory,
  updateExpenseItem,
} from '@/app/features/expensesSlice'
import { Timestamp } from 'firebase/firestore'

interface Props {
  show: boolean
  onClose: Dispatch<SetStateAction<boolean>>
}

function AddExpensesModal({ show, onClose }: Props) {
  const [expenseAmont, setExpenseAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const { expenses, loading } = useSelector((state) => state.expenses)
  const { user } = useSelector((state) => state.users)
  const titleRef = useRef<HTMLInputElement>()
  const colorRef = useRef<HTMLInputElement>()
  const dispatch = useDispatch()

  const addExpenseItemHandler = (expenseCategoryId: string) => {
    const expense = expenses.find((e) => {
      return e.id === selectedCategory
    })
    const newExpense: Expense = {
      id: selectedCategory,
      uid: user.uid,
      color: expense.color,
      title: expense.title,
      total: expense.total + +expenseAmont,
      items: [
        {
          amount: +expenseAmont,
          createdAt: Timestamp.fromDate(new Date()),
          id: uuidv4(),
        },
        ...expense.items,
      ],
    }
    dispatch(updateExpenseItem(newExpense))

    console.log(newExpense, 'newexpense')
    setExpenseAmount('')
    setSelectedCategory('')
    onClose(false)
  }

  const addExpenseCatgoryHandler = async () => {
    const title = titleRef.current!.value
    const color = colorRef.current!.value
    const newExpenseCategory = {
      title: title,
      color: color,
      total: 0,
    }
    dispatch(addExpenseCatgory(newExpenseCategory))
    setShowAddCategory(false)
  }

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <label htmlFor="">Enter an amount ...</label>
        <input
          type="number"
          min={0.01}
          step={0.01}
          placeholder="Enter expense amount"
          value={expenseAmont}
          onChange={(e) => {
            setExpenseAmount(+e.target.value)
          }}
        />
      </div>

      {expenseAmont > 0 && (
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl capitalize">Select Expense Category</h3>
            <button
              className="text-lime-400"
              onClick={() => {
                setShowAddCategory(true)
              }}
            >
              +New Category
            </button>
          </div>

          {showAddCategory && (
            <div className="flex items-center justify-between">
              <input type="text" placeholder="Enter Title" ref={titleRef} />
              <label htmlFor="color">Pick Color</label>
              <input type="color" className="w-24 h-10" ref={colorRef} />
              <button
                className="btn btn-primary-ouline"
                onClick={addExpenseCatgoryHandler}
              >
                Create
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setShowAddCategory(false)
                }}
              >
                Cancel
              </button>
            </div>
          )}
          {expenses.map((expense) => {
            return (
              <button
                key={expense.id}
                onClick={() => setSelectedCategory(expense.id)}
              >
                <div
                  style={{
                    boxShadow:
                      expense.id === selectedCategory ? '1px 1px 4px' : 'none',
                  }}
                  className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-[25px] h-[25px] rounded-full "
                      style={{ backgroundColor: expense.color }}
                    />
                    <h4 className="capitalize">{expense.title}</h4>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
      {expenseAmont > 0 && selectedCategory && (
        <button
          className="btn btn-primary mt-6"
          onClick={() => addExpenseItemHandler(selectedCategory)}
        >
          Add Expense
        </button>
      )}
    </Modal>
  )
}

export default AddExpensesModal
