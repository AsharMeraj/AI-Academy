'use client'
import React, { useState } from 'react'
import DashboardHeader from '../dashboard/_components/DashboardHeader'
import { Bounce, ToastContainer } from 'react-toastify'
import { ResultDataContext } from '../_context/CourseCountContext'
import { Notes } from '../_types/Types'

const CourseViewLayout = ({ children }: { children: React.ReactNode }) => {
  const [Result, setResult] = useState<Notes>({} as Notes)
  return (
    <ResultDataContext.Provider value={{Result, setResult}}>

      <div>
        <DashboardHeader />
        <div className='mx-5 md:mx-36 mt-10 max-w-3xl lg:mx-auto'>
          {children}
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </div>
    </ResultDataContext.Provider>
  )
}

export default CourseViewLayout