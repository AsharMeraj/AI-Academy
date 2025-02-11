'use client'
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import MobileHeader from './MobileHeader'
import { Menu } from 'lucide-react'

const DashboardHeader = () => {
  const path = usePathname()
  const { user } = useUser()
  const [showNavbar, setShowNavbar] = useState<boolean>(false)
  return (
    <>
      <div className={`p-5 shadow-md w-full bg-white z-40 flex ${path !== "/dashboard" && path !== "/dashboard/upgrade" ? 'justify-between' : "justify-end"}`}>
        {
          path === '/create(*)' &&
          <div className='flex gap-2 items-center'>
            <Image src={'/logo.svg'} width={35} height={35} alt='/' />
            <h2 className='font-extrabold text-xl'>AI Academy</h2>
          </div>
        }
        <div className={`items-center gap-2 flex w-full justify-between md:justify-end`}>
          {user ? <UserButton /> : <div className='rounded-full p-[0.9rem] bg-slate-200 animate-pulse'></div>}
          {path !== '/create' && path!=='/dashboard' && <Link href={'/dashboard'} className='hidden md:block'><Button>Dashboard</Button></Link>}
        </div>
        <div className='flex items-center gap-2 md:hidden' onClick={() => setShowNavbar(true)}>
          <Menu color="#305cde" size={30}/>
        </div>
      </div>
      <section className={`fixed z-50 inset-0 duration-700 ${showNavbar? "translate-y-0" : "translate-y-[-60rem]"}`}>
        <MobileHeader setShowNavbar={setShowNavbar}/>
      </section>
    </>
  )
}

export default DashboardHeader