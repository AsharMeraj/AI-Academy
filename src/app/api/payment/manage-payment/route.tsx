import { NextResponse } from "next/server";
import Stripe from 'stripe'

export async function POST(req: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    try {
    const returnUrl = `http://asharmeraj.vercel.app/`;
    const { customerId } = await req.json();
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });
        return NextResponse.json( portalSession )
    } catch (error) {
        return NextResponse.json({error: error})
    }

}