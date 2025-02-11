'use client'
import { useUser } from '@clerk/nextjs'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoMdHome } from "react-icons/io";
import { IoCreate } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { MdWorkspacePremium } from "react-icons/md";

const MobileHeader = ({ setShowNavbar }: { setShowNavbar: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { user } = useUser()
    return (
        <section className='w-full h-screen border grid place-items-center z-50 fixed inset-0 backdrop-blur-lg bg-white/80'>
            <X size={30} color="#305cde" className='absolute top-0 right-0 mt-8 mr-6' onClick={() => setShowNavbar(false)} />
            <div className='flex gap-2 items-center absolute top-0 left-0 m-8'>
                <Image src={'/logo.svg'} width={35} height={35} alt='/' />
                {/* <h2 className='font-extrabold text-xl'>AI Academy</h2> */}
            </div>
            <div className='text-center flex flex-col gap-4'>
                <Link className='flex items-center' href={'/'} onClick={() => setShowNavbar(false)}>
                    <IoMdHome size={30} color='#305CDE'/>
                    <h2 className='border-y p-3 text-primary text-xl'>Home</h2>
                </Link>
                <Link className='flex items-center' href={'/create'} onClick={() => setShowNavbar(false)}>
                    <IoCreate size={30} color='#305CDE'/>
                    <h2 className='border-y p-3 text-primary text-xl'>Create</h2>
                </Link>
                <Link className='flex items-center' href={'/dashboard'} onClick={() => setShowNavbar(false)}>
                    <MdDashboard size={30} color='#305CDE'/>
                    <h2 className='border-y p-3 text-primary text-xl'>Dashboard</h2>
                </Link>
                <Link className='flex items-center' href={'/dashboard/profile'} onClick={() => setShowNavbar(false)}>
                    <MdAccountCircle size={30} color='#305CDE'/>
                    <h2 className='border-y p-3 text-primary text-xl'>Profile</h2>
                </Link>
                <Link className='flex items-center' href={'/dashboard/upgrade'} onClick={() => setShowNavbar(false)}>
                    <MdWorkspacePremium size={30} color='#305CDE'/>
                    <h2 className='border-y p-3 text-primary text-xl'>Upgrade</h2>
                </Link>
                {
                    !user &&
                    <Link className='flex justify-between' href={'/dashboard/upgrade'} onClick={() => setShowNavbar(false)}>
                        <h2 className='border-y p-3 text-primary text-xl'>Login</h2>
                    </Link>
                }

            </div>
        </section>
    )
}

export default MobileHeader