'use client'
import { UserType } from '@/app/_types/Types';
import { Button } from '@/components/ui/button';
import { db } from '@/configs/db';
import { USER_TABLE } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { LucideLoaderCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const Pricing = () => {
    const { user } = useUser()
    const [userDetail, setUserDetail] = useState<UserType>({} as UserType)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        user && GetUserDetail()
    }, [user])
    const GetUserDetail = async () => {
        if (user?.primaryEmailAddress?.emailAddress) {
            const result = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress))
            setUserDetail(result[0])
            console.log(result[0])
        }
    }
    const OnCheckoutClick = async () => {
        setLoading(true)
        const result = await axios.post('/api/payment/checkout', {
            priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID as string
        })
        console.log(result.data)
        window.open(result.data.session.url)
        setLoading(false)
    }

    const onPaymentManage = async () => {
        setLoading(true)
        console.log(userDetail.customerId)
        const result = await axios.post('/api/payment/manage-payment', {
            customerId: userDetail.customerId,
        })
        console.log(result.data)
        window.open(result.data.url)
        setLoading(false)

    }
    return (
        <div>
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-center mt-8 sm:text-2xl">Pricing</h2>
                <p className="max-w-3xl mx-auto mt-1  text-center">
                    Get started on our free plan and upgrade when you are ready.
                </p>
            </div>
            <div className="mt-12 lg:px-8 mx-auto container space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
                {/* Free Plan */}
                <div className="relative p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col">
                    <div className="flex-1">
                        <h3 className="font-semibold">Free</h3>
                        <p className="mt-4 flex items-baseline">
                            <span className="text-4xl font-extrabold tracking-tight">$0</span>
                            <span className="ml-1 text-xl font-semibold">/month</span>
                        </p>
                        <p className="mt-6">You just want to discover</p>
                        <ul role="list" className="mt-6 space-y-3">
                            <li className="flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0 w-6 h-6 text-primary"
                                    aria-hidden="true"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="ml-3 text-sm">10 Credits</span>
                            </li>
                            <li className="flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0 w-6 h-6 text-primary"
                                    aria-hidden="true"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="ml-3 text-sm">Generate video (2 credits)</span>
                            </li>
                            <li className="flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0 w-6 h-6 text-primary"
                                    aria-hidden="true"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="ml-3 text-sm">Quizz (1 credit)</span>
                            </li>
                        </ul>
                    </div>
                    <Button variant={'outline'}>Signup of free</Button>
                </div>

                {/* Pro Plan */}
                <div className="relative p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col">
                    <div className="flex-1">
                        <h3 className="font-semibold">Pro</h3>
                        <p className="absolute top-0 py-1.5 px-4 bg-primary text-white rounded-full text-[11px] font-semibold uppercase tracking-wide transform -translate-y-1/2">
                            Most popular
                        </p>
                        <p className="mt-4 flex items-baseline">
                            <span className="text-3xl font-extrabold tracking-tight">$12</span>
                            <span className="ml-1 text-xl font-semibold">/month</span>
                        </p>
                        <p className="mt-6">You want to learn and have a personal assistant</p>
                        <ul role="list" className="mt-6 space-y-3">
                            <li className="flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0 w-6 h-6 text-primary"
                                    aria-hidden="true"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="ml-3 text-sm">30 credits</span>
                            </li>
                            <li className="flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0 w-6 h-6 text-primary"
                                    aria-hidden="true"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="ml-3 text-sm">Powered by GPT-4 (more accurate)</span>
                            </li>
                            <li className="flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0 w-6 h-6 text-primary"
                                    aria-hidden="true"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="ml-3 text-sm">Generate video (2 credits)</span>
                            </li>
                            <li className="flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0 w-6 h-6 text-primary"
                                    aria-hidden="true"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="ml-3 text-sm">Quizz (1 credit)</span>
                            </li>
                            <li className="flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0 w-6 h-6 text-primary"
                                    aria-hidden="true"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="ml-3 text-sm ">Analytics on the quizz</span>
                            </li>
                        </ul>
                    </div>
                    {
                        userDetail?.isMember === false ?
                            <Button
                                className='mt-8'
                                onClick={OnCheckoutClick}
                            >
                                {
                                    loading ?
                                        <span className='flex items-center  gap-2 justify-center'>
                                            <h2>Get Started</h2> <LucideLoaderCircle className='animate-spin' />
                                        </span>

                                        :
                                        <span>Get Started</span>
                                }
                            </Button>
                            :
                            <Button
                                className='mt-8'
                                onClick={onPaymentManage}
                            >
                                {
                                    loading ?
                                        <span className='flex items-center  gap-2 justify-center'>
                                            <h2>Manage Payment</h2> <LucideLoaderCircle className='animate-spin' />
                                        </span>

                                        :
                                        <span>Manage Payment</span>
                                }
                            </Button>
                    }
                </div>
            </div>
        </div >
    );
};

export default Pricing;
