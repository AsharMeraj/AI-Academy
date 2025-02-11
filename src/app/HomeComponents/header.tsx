'use client'
import Logo from "./logo";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import MobileHeader from "../dashboard/_components/MobileHeader";
import { useState } from "react";

export default function Header() {
  const path = usePathname()
  const { user } = useUser()
  const [showNavbar, setShowNavbar] = useState<boolean>(false)
  return (
    <>
      <div className={`p-5 shadow-md top-0 fixed w-full justify-between bg-white z-40 flex `}>
        <div className='flex gap-2 items-center '>
          <Image src={'/logo.svg'} width={35} height={35} alt='/' />
          <h2 className='font-extrabold text-xl'>AI Academy</h2>
        </div>
        <div className={`${user && "hidden md:block"}`}>
          {
            user ? <div className="block md:hidden"><UserButton /></div> : <Link href={'/dashboard'}><Button>Login</Button></Link>
          }
        </div>
        {
          user &&
          <>
            <div className='flex items-center gap-2'>
              <div className="flex items-center justify-center gap-2">
                <UserButton  />
                <Link href={'/dashboard'} className="hidden md:block"><Button>Dashboard</Button></Link>
              </div>
              <div className="block md:hidden" onClick={() => setShowNavbar(true)}>
                <Menu color="#305cde" size={30}/>
              </div>
            </div>
          </>

        }
      </div>
      <section className={`fixed z-50 inset-0 duration-700 ${showNavbar ? "translate-y-0" : "translate-y-[-60rem]"}`}>
        <MobileHeader setShowNavbar={setShowNavbar} />
      </section>
    </>
  );
}
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Menu, X } from "lucide-react";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <header className="fixed top-2 z-30 w-full md:top-6">
//       <div className="w-full px-4 sm:px-6">
//         <div className="relative mx-auto flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-sm">
//           {/* Logo */}
//           <div className="flex gap-2 items-center">
//             <Image src="/logo.svg" width={40} height={40} alt="/" />
//           </div>

//           {/* Mobile Menu Button */}
//           <button 
//             className="md:hidden p-2 text-gray-800 focus:outline-none"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>

//           {/* Desktop Navigation */}
//           <ul className="hidden md:flex flex-1 items-center justify-end gap-3">
//             <li>
//               <Link href="/dashboard">
//                 <Button variant="outline">Login</Button>
//               </Link>
//             </li>
//             <li>
//               <Link href="/dashboard">
//                 <Button>Register</Button>
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* Mobile Navigation */}
//         <div
//           className={`md:hidden absolute top-16 left-0 w-full bg-white shadow-md transition-all duration-300 ease-in-out ${
//             isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//           }`}
//         >
//           <ul className="flex flex-col items-center gap-4 py-4">
//             <li>
//               <Link href="/dashboard" onClick={() => setIsOpen(false)}>
//                 <Button variant="outline" className="w-32">
//                   Login
//                 </Button>
//               </Link>
//             </li>
//             <li>
//               <Link href="/dashboard" onClick={() => setIsOpen(false)}>
//                 <Button className="w-32">Register</Button>
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </header>
//   );
// }

