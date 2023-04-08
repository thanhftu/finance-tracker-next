'use client'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '.'

function userState() {
  const { user, loading } = useAuthState(auth)
  return { user, loading }
}

export default userState
