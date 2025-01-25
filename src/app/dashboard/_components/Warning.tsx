import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface WarningType {
    DeleteRecord: () => Promise<void>,
    isEnabled: boolean,
    setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>
}


const Warning = (props: WarningType) => {
    return (
        <AlertDialog open={props.isEnabled}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your data
                        and remove all your notes from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => props.setIsEnabled(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {props.setIsEnabled(false); props.DeleteRecord()}}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Warning