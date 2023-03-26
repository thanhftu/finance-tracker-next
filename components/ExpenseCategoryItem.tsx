import React from 'react'
import { currencyFormatter } from '@/lib/utils'

interface Props {
    amount:number,
    title:string,
    color:string
}
function ExpenseCategoryItem({amount, title, color}:Props) {
  return (
    <button>
    <div className='flex justify-between items-center px-4 py-4 bg-slate-700 rounded-3xl'>
    <div className='flex items-center gap-2'>
      <div className="w-[25px] h-[25px] rounded-full "
      style={{backgroundColor:color}}
      />
      <h4>{title}</h4>
    </div>
    <p>{currencyFormatter("USD",amount)}</p>
  </div>
  </button>
  
  )
}

export default ExpenseCategoryItem