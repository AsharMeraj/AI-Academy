'use client';
import { db } from '@/configs/db';
import { USER_TABLE } from '@/configs/schema';
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm';
import React, { useEffect } from 'react'
import axios from 'axios'

const Provider = ({ children }: { children: React.ReactNode }) => {

  const { user } = useUser()

  useEffect(() => {
    user && isNewUser()
  }, [user])

  const isNewUser = async () => {
  
    const resp = await axios.post('/api/create-user',{user:user})

  }
  return (
    <div>{children}</div>
  )
}

export default Provider