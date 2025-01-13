import React from 'react'
import {
    AlertDialog,
    // AlertDialogAction,
    // AlertDialogCancel,
    AlertDialogContent,
    // AlertDialogDescription,
    // AlertDialogFooter,
    // AlertDialogHeader,
    AlertDialogTitle,
    // AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from 'next/image'


const CustomLoading = ({ loading }: { loading: boolean }) => {
    return (
        <AlertDialog open={loading}>
            <AlertDialogContent>
                <div className='flex flex-col items-center my-10 justify-center'>
                    <Image src={'/progress2.gif'} alt='' width={100} height={100}/>
                    <h2>Generating your course... Do not Refresh</h2>
                </div>
            </AlertDialogContent>
            <div className='hidden'>
            <AlertDialogTitle></AlertDialogTitle>
            </div>
        </AlertDialog>

    )
}

export default CustomLoading