'use client'
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const DashboardHeader = () => {
  const path = usePathname()
  const { user } = useUser()
  return (
    <div className={`p-5 shadow-md flex ${path !== "/dashboard" && path!=="/dashboard/upgrade" ? 'justify-between' : "justify-end"}`}>
      {
        path !== '/dashboard' && path !== '/dashboard/upgrade' &&
        <div className='flex gap-2 items-center'>
          <Image src={'/logo.svg'} width={40} height={40} alt='/' />
          <h2 className='font-bold text-2xl'>AI Academy</h2>
        </div>
      }
      <div className='flex items-center gap-2'>
        {user ? <UserButton /> : <div className='rounded-full p-[0.9rem] bg-slate-200 animate-pulse'></div>}
        {path!=='/dashboard' && path!== '/dashboard/upgrade' && <Link href={'/dashboard'}><Button>Dashboard</Button></Link>}
      </div>
    </div>
  )
}

export default DashboardHeader