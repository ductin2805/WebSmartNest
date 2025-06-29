import React from "react";
import NavbarNestMart from "../components/NavbarNestMart";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarNestMart />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-gray-800 text-white text-center py-4">
                © 2025 Traveloka Clone. All rights reserved.
            </footer>
        </div>
    );
};

export default MainLayout;
