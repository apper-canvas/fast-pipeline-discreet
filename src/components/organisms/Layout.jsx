import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import QuickAddModal from "@/components/organisms/QuickAddModal";

const Layout = () => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onQuickAdd={() => setIsQuickAddOpen(true)} />
      
      <main className="p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
};

export default Layout;