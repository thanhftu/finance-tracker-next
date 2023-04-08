'use client'
import { useState, useRef, useEffect } from 'react'
import { ImStatsBars } from 'react-icons/im'

import { currencyFormatter } from '@/lib/utils'
import ExpenseCategoryItem from '@/components/ExpenseCategoryItem'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useDispatch, useSelector } from 'react-redux'
import AddIncomeModal from '@/components/modals/AddIncomeModal'
import { getExpenses } from './features/expensesSlice'
import { Income } from './models'
import AddExpensesModal from '@/components/modals/AddExpensesModal'
import ViewExpenseModal from '@/components/modals/ViewExpenseModal'
import Signin from '@/components/Signin'
import { auth } from '@/lib/firebase'
import { getUserFromLocal } from './features/usersSlice'
import { useAuthState } from 'react-firebase-hooks/auth'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Home() {
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showAddExpensesModal, setShowAddExpensesModal] = useState(false)
  const [balance, setBalance] = useState(0)
  const [incomeTotal, setIncomeTotal] = useState(0)
  const [expenseTotal, setExpenseTotal] = useState(0)
  const { expenses, loading } = useSelector((state) => state.expenses)
  const { incomes } = useSelector((state) => state.incomes)
  const { user } = useSelector((state) => state.users)
  console.log(user, 'user')
  console.log(expenses, 'expenses')
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) return

    dispatch(getExpenses(user.uid))
  }, [user])
  useEffect(() => {
    const newIncomeTotal = incomes.reduce((total, i) => {
      return total + i.amount
    }, 0)
    const newExpenseTotal = expenses.reduce((total, i) => {
      return total + i.total
    }, 0)
    const newBanlance = newIncomeTotal - newExpenseTotal
    setIncomeTotal(newIncomeTotal)
    setExpenseTotal(newExpenseTotal)
    setBalance(newBanlance)
  }, [expenses, incomes])
  if (!user) {
    return <Signin />
  }
  return (
    <>
      {/* Modal */}
      <AddIncomeModal show={showIncomeModal} setShow={setShowIncomeModal} />
      <AddExpensesModal
        show={showAddExpensesModal}
        onClose={setShowAddExpensesModal}
      />
      <main className="container max-w-2xl px-6 py-6 mx-auto">
        <div className="bg-slate-700 rounded px-3 py-2">
          <section className="flex items-center justify-between py-3">
            <div>
              <small className="text-gray-400 text-md">My Balance</small>
              <h2 className="text-4xl font-bold">
                {currencyFormatter('VND', balance)}
              </h2>
            </div>
            <div>
              <small className="text-lime-500 text-md">Total Income</small>
              <h2 className="text-lime-500 text-xl font-bold">
                {currencyFormatter('USD', incomeTotal)}
              </h2>
            </div>

            <div>
              <small className="text-red-500 text-md">Total Exoenses</small>
              <h2 className=" text-red-500 text-xl font-bold">
                {currencyFormatter('USD', expenseTotal)}
              </h2>
            </div>
          </section>
        </div>

        <section className="flex items-center gap-2 py-3">
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddExpensesModal(true)
            }}
          >
            + Expenses
          </button>
          <button
            className="btn btn-primary-ouline"
            onClick={() => {
              setShowIncomeModal(true)
            }}
          >
            + Income
          </button>
        </section>

        {/* Expense */}
        <section>
          <h3>My Expenses</h3>
          <div className="flex flex-col gap-4">
            {expenses.map((expense) => (
              <ExpenseCategoryItem
                color={expense.color}
                title={expense.title}
                amount={expense.total}
                key={expense.id}
                expense={expense}
              />
            ))}
          </div>
        </section>

        {/* Chart */}
        <section className="py-6">
          <h3 className="text-2x1">Stats</h3>
          <div className="w-1/2 mx-auto">
            <Doughnut
              data={{
                labels: expenses.map((expense) => expense.title),
                datasets: [
                  {
                    label: 'Expense',
                    data: expenses.map((expense) => expense.total),
                    backgroundColor: expenses.map((expense) => expense.color),
                    borderColor: ['#181818'],
                    borderWidth: 5,
                  },
                ],
              }}
            />
          </div>
        </section>
      </main>
    </>
  )
}
