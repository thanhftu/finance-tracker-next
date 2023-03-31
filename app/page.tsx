'use client'
import { useState, useRef, useEffect } from 'react'
import { ImStatsBars } from 'react-icons/im'

import { currencyFormatter } from '@/lib/utils'
import ExpenseCategoryItem from '@/components/ExpenseCategoryItem'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'
import AddIncomeModal from '@/components/modals/AddIncomeModal'
import { Income } from './models'

ChartJS.register(ArcElement, Tooltip, Legend)

const DUMMY_DATA = [
  {
    id: 1,
    title: 'Entertainment',
    color: 'purple',
    total: 500,
  },
  {
    id: 2,
    title: 'Gass',
    color: 'pink',
    total: 200,
  },
  {
    id: 3,
    title: 'Fuel',
    color: 'violet',
    total: 1200,
  },
  {
    id: 4,
    title: 'Movies',
    color: 'orange',
    total: 800,
  },
  {
    id: 5,
    title: 'Holiday',
    color: 'red',
    total: 2000,
  },
]

export default function Home() {
  const [income, setIncome] = useState<Income[]>([])
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  console.log(income)

  return (
    <>
      {/* Modal */}
      <AddIncomeModal show={showIncomeModal} setShow={setShowIncomeModal} />

      <main className="container max-w-2xl px-6 py-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">
            {currencyFormatter('USD', 1000000)}
          </h2>
        </section>

        <section className="flex items-center gap-2 py-3">
          <button className="btn btn-primary">+ Expenses</button>
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
            {DUMMY_DATA.map((expense) => (
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
                labels: DUMMY_DATA.map((expense) => expense.title),
                datasets: [
                  {
                    label: 'Expense',
                    data: DUMMY_DATA.map((expense) => expense.total),
                    backgroundColor: DUMMY_DATA.map((expense) => expense.color),
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
