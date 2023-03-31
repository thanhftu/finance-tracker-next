import React, { Dispatch, SetStateAction, useRef, useEffect } from 'react'
import Modal from '@/components/Modal'
import { FaRegTrashAlt } from 'react-icons/fa'
import { Income } from '@/app/models'
import { currencyFormatter } from '@/lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { getIncomes, deleteIncome, addIncome } from '@/app/features/incomeSlice'
import { AppDispatch } from '@/app/store'

interface Props {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
}

interface RootState {
  incomes: {
    id: string
    amount: number
    description: string
    createdAt: Date
  }[]
  loading: boolean
}
function AddIncomeModal({ show, setShow }: Props) {
  const amountRef = useRef<HTMLInputElement>(null)
  const DescriptionRef = useRef<HTMLInputElement>(null)
  const dispatch: AppDispatch = useDispatch()

  const { incomes, loading } = useSelector((state) => state.incomes)
  //   console.log(incomes, 'income')
  console.log(loading, 'loading')
  const addIncomeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newIncome = {
      amount: parseFloat(amountRef.current!.value),
      description: DescriptionRef.current!.value,
      createdAt: new Date(),
    }
    dispatch(addIncome(newIncome))
    amountRef.current!.value = ''
    DescriptionRef.current!.value = ''
  }

  useEffect(() => {
    dispatch(getIncomes())
  }, [])
  return (
    <Modal show={show} onClose={setShow}>
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
      <div className="container overflow-auto bg-slate-700 rounded-xl mt-6 mb-6 p-4">
        <div className="flex flex-col gap-4">
          <h3 className="tex-2xl font-semibold">Income history</h3>
          <div className="flex flex-col gap-5">
            {incomes.map((i) => (
              <div key={i.id} className="flex justify-between items-center">
                <div>
                  <p className="text-semibold">{i.description}</p>
                  <small className="text-xs">{i.createdAt.toISOString()}</small>
                </div>
                <div className="flex items-center gap-2">
                  <p>{currencyFormatter('USD', i.amount)}</p>
                  <button
                    onClick={() => {
                      dispatch(deleteIncome(i.id))
                    }}
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AddIncomeModal
