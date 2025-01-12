'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useContext, useEffect } from 'react'
import {LayoutDashboard, Shield, UserCircle} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { CourseCountContext } from '@/app/_context/CourseCountContext'

const Sidebar = () => {
  const MenuList = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      name: 'Upgrade',
      icon: Shield,
      path: '/dashboard/upgrade'
    },
    {
      name: 'Profile',
      icon: UserCircle,
      path: '/dashboard/profile'
    },
  ]

  const {totalCourse, setTotalCourse} = useContext(CourseCountContext)

  useEffect(() => {
    setTotalCourse(totalCourse)
  },[totalCourse])

  const path = usePathname()
  return (
    <div className='h-screen shadow-md p-5'>
        <div className='flex gap-2 items-center'>
          <Image src={'/logo.svg'} width={40} height={40} alt='/' />
          <h2 className='font-bold text-2xl'>AI Academy</h2>
        </div>
        <div className='mt-10'>
          <Link href={'/create'} className='w-full'>
          <Button className='w-full'>+ Create New</Button>
          </Link>
          <div className='mt-5 '>
            {MenuList.map((item, index) => (
              <Link href={`${item.path}`} key={index} className={`flex gap-2 items-center p-3 hover:bg-slate-200 rounded-lg cursor-pointer mt-3 ${path===item.path && 'bg-slate-200'}`}>
                <item.icon/>
                <h2>{item.name}</h2>
              </Link>
            ))}
          </div>
        </div>
        <div className='border p-3 bg-slate-100 rounded-lg absolute bottom-10 w-[85%]'>
          <h2 className='text-lg'>Available Credits: 5</h2>
          <Progress value={(totalCourse/5)*100}/>
          <h2 className='text-sm'>{totalCourse} Out of 5 Credits Used</h2>

          <Link href={'/dashboard/upgrade'} className='text-primary text-xs mt-3'>Upgrade to Create more</Link>
        </div>
    </div>
  )
}

export default Sidebar