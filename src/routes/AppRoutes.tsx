// app/router.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import NavbarNestMart from "../components/NavbarNestMart";
import SearchBar from "../components/SearchPanel";
import HomePage from "../pages/HomePage";
import Footer from "../components/Footer";
import ProductSearchPage from "../pages/ProductSearchPage";
import LoginPage from "../pages/LoginPage";
import PartnerHome from "../pages/PartnerHome";
import CreatePostPage from "../pages/CreatePostPage";
import PostList from '../pages/PostList';
import UserProfilePage from "../pages/UserProfilePage";
import PostDetailPage from "../pages/PostDetailPage";
import ProductManagementPage from "../pages/ProductManagementPage";
import AIChatWidget from '../components/AIChatWidget';
import NavbarPartner from "../components/NavbarPartner";
import EditPostPage from "../pages/EditPostPage";
import NotificationDetail from "../components/NotificationDetail";
const LayoutWithRouter: React.FC = () => {
    const location = useLocation();

    const isPartnerPath = location.pathname.startsWith('/partner');
    const isLoginPath = location.pathname === '/partner/login';

    return (
        <>
            {/* Navbar hiển thị tùy thuộc vào path */}
            {!isPartnerPath && <NavbarNestMart />}
            {isPartnerPath && !isLoginPath && <NavbarPartner />}

            <Routes>
                <Route path="/" element={<><SearchBar /><HomePage /></>} />
                <Route path="/tim-kiem" element={<ProductSearchPage />} />
                <Route path="/partner/login" element={<LoginPage onClose={() => {}} />} />
                <Route path="/partner/home" element={<PartnerHome />} />
                <Route path="/partner/create" element={<CreatePostPage />} />
                <Route path="/posts" element={<PostList />} />
                <Route path="/partner/profile" element={<UserProfilePage />} />
                <Route path="/posts/:id" element={<PostDetailPage />} />
                <Route path="/edit-post/:id" element={<EditPostPage />} />
                <Route path="/partner/posts" element={<ProductManagementPage />} />
                <Route path="/partner/notification/:id" element={<NotificationDetail />} />
            </Routes>

            <AIChatWidget />
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
