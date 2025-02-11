'use client'
import { UserProfile } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div><UserProfile routing='hash'/></div>
  )
}

export default page