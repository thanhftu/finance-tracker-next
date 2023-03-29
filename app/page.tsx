'use client'
import { useState, useRef, useEffect } from 'react'
import { ImStatsBars } from 'react-icons/im'
import { FaRegTrashAlt } from 'react-icons/fa'
import { currencyFormatter } from '@/lib/utils'
import ExpenseCategoryItem from '@/components/ExpenseCategoryItem'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import Modal from '@/components/Modal'

import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'

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

interface Income {
  id: string
  description: string
  amount: number
  createdAt: Date
}

export default function Home() {
  const [income, setIncome] = useState<Income[]>([])
  console.log(income)
  const amountRef = useRef<HTMLInputElement>(null)
  const DescriptionRef = useRef<HTMLInputElement>(null)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const collectionRef = collection(db, 'income')

  const addIncomeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newIncome = {
      amount: parseFloat(amountRef.current!.value),
      description: DescriptionRef.current!.value,
      createdAt: new Date(),
    }

    try {
      const docSnap = await addDoc(collectionRef, newIncome)
      // console.log(docSnap.id)
      setIncome((prev) => [{ id: docSnap.id, ...newIncome }, ...prev])
      amountRef.current!.value = ''
      DescriptionRef.current!.value = ''
    } catch (error) {
      console.log(error)
    }
  }
  const deleteIncomeHandler = async (id: string) => {
    const docRef = doc(db, 'income', id)
    try {
      await deleteDoc(docRef)
      setIncome((prev) => {
        return prev.filter((i) => i.id !== id)
      })
    } catch (error) {}
  }
  const getIncomes = async () => {
    const docSnap = await getDocs(collectionRef)
    const data = docSnap.docs.map((doc) => {
      return {
        id: doc.id,
        description: doc.data().description,
        amount: doc.data().amount,
        createdAt: new Date(doc.data().createdAt.toMillis()),
      }
    })
    setIncome(data)
  }
  useEffect(() => {
    getIncomes()
  }, [])
  return (
    <>
      {/* Modal */}
      <Modal show={showIncomeModal} onClose={setShowIncomeModal}>
        <form onSubmit={addIncomeHandler} className="flex flex-col gap-4">
          <div className="input-group">
            <label htmlFor="amount">Income Amount</label>
            <input
              ref={amountRef}
              type="number"
              min={0.01}
              step={0.01}
              placeholder="Enter income amont"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="decription">Description</label>
            <input
              ref={DescriptionRef}
              type="text"
              min={0.01}
              step={0.01}
              placeholder="Description"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary self-start">
            Add Entry
          </button>
        </form>
        <div className="container overflow-auto">
          <div className="flex flex-col gap-4 mt-6">
            <h3 className="tex-2xl font-semibold">Income history</h3>
            <div className="flex flex-col gap-5">
              {income.map((i) => (
                <div key={i.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-semibold">{i.description}</p>
                    <small className="text-xs">
                      {i.createdAt.toISOString()}
                    </small>
                  </div>
                  <p className="flex items-center gap-2">
                    {currencyFormatter('USD', i.amount)}
                    <button
                      onClick={() => {
                        deleteIncomeHandler(i.id)
                      }}
                    >
                      <FaRegTrashAlt />
                    </button>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

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
