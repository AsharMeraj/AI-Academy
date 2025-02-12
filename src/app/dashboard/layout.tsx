'use client';
import React from 'react';
import Sidebar from './_components/Sidebar';
import DashboardHeader from './_components/DashboardHeader';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="md:w-64 hidden md:block fixed">
        <Sidebar />
      </div>
      <div className="md:ml-64">
        <DashboardHeader />
        <div className="m-5 md:m-0 md:p-10 ">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
