import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useDispatch } from 'react-redux'
import { googleLoginHandler } from '@/app/features/usersSlice'

function Signin() {
  const dispatch = useDispatch()
  const loginHandler = () => {
    dispatch(googleLoginHandler())
  }
  return (
    <main className="container max-w-2xl px-6 mx-auto">
      <h1 className="mb-6 text-6xl font-bold text-center">Welcom !</h1>
      <div className="flex flex-col overflow-hidden shadow-md shadow-slate-500">
        <div className="h-52">
          <img
            className="object-cover w-full h-full"
            src="https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_960_720.jpg"
            alt=""
          />
        </div>
        <div className="text-2x text-center">
          <h3>please sign in</h3>
          <button
            onClick={loginHandler}
            className="flex self-start gap-2 p-4 mx-auto mt-6"
          >
            <FcGoogle className="text-2xl" /> Google
          </button>
        </div>
      </div>
    </main>
  )
}

export default Signin
