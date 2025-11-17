import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {

  return (
    <div className="min-h-screen bg-background">
<Header />
      
      <main className="p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;