import React,{Dispatch,SetStateAction} from 'react'

interface Props {
    show:boolean,
    onClose:Dispatch<SetStateAction<boolean>>,
    children: React.ReactNode
}
function Modal({show, onClose, children}:Props) {
  return (

    <div style={{
        transform:show?"translateX(0%)":"translateX(-200%)"
    }} 
    className='absolute top-0 left-0 w-full h-full z-10 transition-all duration-100'>
      <div className='container mx-auto max-w-2xl h-[80vh] bg-slate-800 rounded-3xl px-6 py-4'>
        <button 
        onClick={()=>{onClose(false)}}
        className='h-10 w-10 mb-4 font-bold bg-gray-400 rounded-full'>X</button>
        {children}
      </div>
    </div>
   
  )
}

export default Modal