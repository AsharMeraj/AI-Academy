// import { db } from "@/configs/db";
// import { USER_TABLE } from "@/configs/schema";
// import { eq } from "drizzle-orm";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// export async function POST(req: Request): Promise<Response> {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
//   const webhookSecret = process.env.STRIPE_WEB_HOOK_KEY as string;
//   const signature = req.headers.get("stripe-signature") as string;
//   const body = await req.text();

//   let event: Stripe.Event;



//   if (webhookSecret) {
//     try {
//       event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//     } catch (err) {
//       console.error("⚠️  Webhook signature verification failed:", err);
//       return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
//     }
//   } else {
//     return NextResponse.json({ error: "Webhook secret is not configured." }, { status: 500 });
//   }

//   const { type: eventType, data } = event;

//   switch (eventType) {
//     case "checkout.session.completed": {
//       const session = data.object as Stripe.Checkout.Session;
//       const customerEmail = session.customer_details?.email;
//       const customerId = session.customer; // `customer` is the customer ID

//       console.log("Session Data:", session);
//       console.log("Customer ID:", customerId);
//       console.log("Customer Email:", customerEmail);

//       if (customerEmail && customerId) {
//         try {
//           await db
//             .update(USER_TABLE)
//             .set({
//               isMember: true,
//               customerId: customerId.toString(),
//             })
//             .where(eq(USER_TABLE.email, customerEmail));
//         } catch (err) {
//           console.error("Database update failed:", err);
//           return NextResponse.json(
//             { error: "Database update failed." },
//             { status: 500 }
//           );
//         }
//       }
//       break;
//     }
//     case "invoice.payment_failed": {
//       const invoice = data.object as Stripe.Invoice;
//       const customerEmail = invoice.customer_email;

//       if (customerEmail) {
//         try {
//           await db
//             .update(USER_TABLE)
//             .set({ isMember: false })
//             .where(eq(USER_TABLE.email, customerEmail));
//         } catch (err) {
//           console.error("Database update failed:", err);
//           return NextResponse.json(
//             { error: "Database update failed." },
//             { status: 500 }
//           );
//         }
//       }
//       break;
//     }
//     case "invoice.paid": {
//       // Handle successful payment if needed
//       break;
//     }
//     default:
//       console.warn(`Unhandled event type: ${eventType}`);
//   }

//   return NextResponse.json({ result: "Success" });

// }

import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request): Promise<Response> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const webhookSecret = process.env.STRIPE_WEB_HOOK_KEY as string;

  const signature = req.headers.get("stripe-signature") as string;
  const body = await req.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
  }

  const { type: eventType, data } = event;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        const session = data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email;
        const customerId = session.customer; // `customer` is the customer ID

        console.log("Session Data:", session);
        console.log("Customer ID:", customerId);
        console.log("Customer Email:", customerEmail);

        if (customerEmail && customerId) {
          await db
            .update(USER_TABLE)
            .set({
              isMember: true,
              customerId: customerId.toString(),
            })
            .where(eq(USER_TABLE.email, customerEmail));
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = data.object as Stripe.Invoice;
        const customerEmail = invoice.customer_email;

        if (customerEmail) {
          await db
            .update(USER_TABLE)
            .set({ isMember: false })
            .where(eq(USER_TABLE.email, customerEmail));
        }
        break;
      }
      case "invoice.paid": {
        // Handle successful payment if needed
        break;
      }
      default:
        console.warn(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ result: "Success" });
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

