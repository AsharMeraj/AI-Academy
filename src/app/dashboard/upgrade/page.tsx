'use client'
import { UserType } from '@/app/_types/Types';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { LucideLoaderCircle, Check } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react'

const Pricing = () => {
    const { user } = useUser()
    const [userDetail, setUserDetail] = useState<UserType | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [fetchingUser, setFetchingUser] = useState<boolean>(true)

    // Logic: Moved DB query to a secure API call
    const GetUserDetail = useCallback(async () => {
        if (!user?.primaryEmailAddress?.emailAddress) return;
        
        try {
            setFetchingUser(true);
            const response = await fetch(`/api/user?email=${user.primaryEmailAddress.emailAddress}`);
            const data = await response.json();
            setUserDetail(data.result);
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        } finally {
            setFetchingUser(false);
        }
    }, [user]);

    useEffect(() => {
        GetUserDetail()
    }, [GetUserDetail])

    const OnCheckoutClick = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/payment/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
                })
            });
            const data = await response.json();
            if (data.session?.url) window.open(data.session.url, '_self');
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setLoading(false)
        }
    }

    const onPaymentManage = async () => {
        if (!userDetail?.customerId) return;
        setLoading(true)
        try {
            const response = await fetch('/api/payment/manage-payment', {
                method: 'POST',
                body: JSON.stringify({ customerId: userDetail.customerId })
            });
            const data = await response.json();
            if (data.url) window.open(data.url, '_self');
        } catch (error) {
            console.error("Management error:", error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="py-12 px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight">Pricing</h2>
                <p className="mt-2 text-gray-600">Get started for free and upgrade when you're ready.</p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <PriceCard 
                    title="Free" 
                    price="0" 
                    description="Perfect for discovering the platform"
                    features={["10 Credits", "Generate video (2 credits)", "Quiz (1 credit)"]}
                    buttonText="Sign up for free"
                    variant="outline"
                />

                {/* Pro Plan */}
                <div className="relative p-8 border-2 border-primary rounded-2xl shadow-lg flex flex-col bg-white">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                        Most Popular
                    </span>
                    <div className="flex-1">
                        <h3 className="font-bold text-xl">Pro</h3>
                        <div className="mt-4 flex items-baseline">
                            <span className="text-4xl font-extrabold">$12</span>
                            <span className="ml-1 text-gray-500">/month</span>
                        </div>
                        <ul className="mt-6 space-y-4">
                            <FeatureItem text="30 credits" />
                            <FeatureItem text="Powered by GPT-4" />
                            <FeatureItem text="Generate video (2 credits)" />
                            <FeatureItem text="Analytics on quizzes" />
                        </ul>
                    </div>

                    <Button 
                        className="mt-8 w-full h-12 text-lg" 
                        disabled={loading || fetchingUser}
                        onClick={userDetail?.isMember ? onPaymentManage : OnCheckoutClick}
                    >
                        {loading ? <LucideLoaderCircle className="animate-spin" /> : 
                         userDetail?.isMember ? "Manage Subscription" : "Get Started"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Reusable Sub-components for cleaner code
const FeatureItem = ({ text }: { text: string }) => (
    <li className="flex items-center gap-3">
        <Check className="w-5 h-5 text-primary flex-shrink-0" />
        <span className="text-sm text-gray-600">{text}</span>
    </li>
);

const PriceCard = ({ title, price, description, features, buttonText, variant }: any) => (
    <div className="p-8 border border-gray-200 rounded-2xl flex flex-col hover:shadow-md transition-shadow">
        <div className="flex-1">
            <h3 className="font-bold text-xl">{title}</h3>
            <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold">${price}</span>
                <span className="ml-1 text-gray-500">/month</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">{description}</p>
            <ul className="mt-6 space-y-4">
                {features.map((f: string) => <FeatureItem key={f} text={f} />)}
            </ul>
        </div>
        <Button variant={variant} className="mt-8 w-full">{buttonText}</Button>
    </div>
);

export default Pricing;