import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
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
    <ClerkProvider appearance={{
      variables: {colorPrimary: '#305CDE',} 
      }}>
      <html lang="en">
        <body className={outfit.className}>
          <Provider>
            <NextTopLoader
              color="#305CDE"
              showSpinner={false}
            />
            <ContextWrapper>
              <div className="flex min-h-screen flex-col overflow-hidden ">
                {children}
              </div>
            </ContextWrapper>
          </Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
