import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type PropType = {
    setTopic: (event: string) => void,
    setDifficultyLevel: (value: string) => void
}
const TopicInput = ({setTopic, setDifficultyLevel}: PropType) => {
    return (
        <div className='mt-10 w-full'>
            <h2>Enter the topic or paste the content for which you want to generate study material</h2>
            <Textarea
                placeholder='Start writting here'
                className='mt-2' 
                onChange={(event)=> setTopic(event.target.value)}/>

            <h2 className='mt-5 mb-3'>Select the difficulty level</h2>

            <Select onValueChange={(value)=> setDifficultyLevel(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
            </Select>

        </div>
    )
}

export default TopicInput