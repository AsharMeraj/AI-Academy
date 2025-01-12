import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Bounce, ToastContainer } from 'react-toastify';
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from 'nextjs-toploader'
import ContextWrapper from "./ContextWrapper";

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "AI Academy",
  description: "AI-powered study material generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <Provider>
            <NextTopLoader
              color="#305CDE"
              showSpinner={false}
              />
              <ContextWrapper>
              {children}
            </ContextWrapper>
          </Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
