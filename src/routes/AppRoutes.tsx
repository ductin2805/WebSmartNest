// app/router.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import NavbarTraveloka from "../components/NavbarTraveloka";
import SearchBar from "../components/SearchPanel";
import HomePage from "../pages/HomePage";
import Footer from "../components/Footer";
import ProductSearchPage from "../pages/ProductSearchPage";
import LoginPage from "../pages/LoginPage";
import PartnerHome from "../pages/PartnerHome";
import CreatePostPage from "../pages/CreatePostPage";

// ✅ Tách phần layout ra để có thể truy cập location
const LayoutWithRouter: React.FC = () => {
    const location = useLocation();
    const hideNavbarPaths = ['/partner/home'];

    return (
        <>
            {/* Chỉ hiển thị Navbar nếu không thuộc danh sách loại trừ */}
            {!hideNavbarPaths.includes(location.pathname) && <NavbarTraveloka />}

            <Routes>
                <Route path="/" element={<><SearchBar /><HomePage /></>} />
                <Route path="/tim-kiem" element={<ProductSearchPage />} />
                <Route path="/partner/login" element={<LoginPage onClose={() => {}} />} />
                <Route path="/partner/home" element={<PartnerHome />} />
                <Route path="/partner/create" element={<CreatePostPage />} />

            </Routes>

            {/* Footer luôn hiển thị */}
            <Footer />
        </>
    );
};

const AppRouter: React.FC = () => {
    return (
        <Router>
            <LayoutWithRouter />
        </Router>
    );
};

export default AppRouter;
