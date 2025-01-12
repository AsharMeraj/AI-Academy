import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
        <div>
            <Image src={'/sign.jpg'} alt={'/'} width={500} height={500} 
            className='w-full h-[12rem] md:h-screen object-cover'/>
        </div>
        <div className='flex justify-center items-center h-[calc(100vh-6rem)] md:h-screen'><SignIn/></div>
    </div>
  )

}