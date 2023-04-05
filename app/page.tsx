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

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Home() {
  const [income, setIncome] = useState<Income[]>([])
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showAddExpensesModal, setShowAddExpensesModal] = useState(false)
  const [balance, setBalance] = useState(0)
  const { expenses, loading } = useSelector((state) => state.expenses)
  const { incomes } = useSelector((state) => state.incomes)
  const dispatch = useDispatch()
  console.log(incomes)
  console.log(expenses)

  useEffect(() => {
    dispatch(getExpenses())
  }, [])
  useEffect(() => {
    const newBanlance =
      incomes.reduce((total, i) => {
        return total + i.amount
      }, 0) -
      expenses.reduce((total, i) => {
        return total + i.total
      }, 0)
    setBalance(newBanlance)
  }, [expenses, incomes])
  return (
    <>
      {/* Modal */}
      <AddIncomeModal show={showIncomeModal} setShow={setShowIncomeModal} />
      <AddExpensesModal
        show={showAddExpensesModal}
        onClose={setShowAddExpensesModal}
      />
      <main className="container max-w-2xl px-6 py-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">
            {currencyFormatter('USD', balance)}
          </h2>
        </section>

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
