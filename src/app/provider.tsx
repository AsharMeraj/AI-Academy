'use client';
import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import axios from 'axios'

const Provider = ({ children }: { children: React.ReactNode }) => {

  const { user } = useUser()

  useEffect(() => {
    isNewUser()
  }, [user])

  const isNewUser = async () => {
  
    await axios.post('/api/create-user',{user:user})

  }
  return (
    <div>{children}</div>
  )
}

export default Provider