'use client'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const WelcomeBanner = () => {
    const {user} = useUser()
  return (
    <div className='p-5 bg-primary w-full text-white rounded-lg flex items-center flex-col sm:flex-row gap-2  sm:gap-6'>
        <Image src={'/laptop.png'} alt='/' width={100} height={100} />
        <div>
            <h2 className='font-bold text-2xl'>Hello, {user&&user.fullName}</h2>
            <p className='text-base'>Welcome Back, Its time to get back and start learning new course</p>
        </div>
    </div>
  )
}

export default WelcomeBanner