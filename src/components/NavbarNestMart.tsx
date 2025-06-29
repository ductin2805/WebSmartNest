import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import "./NavbarNestMart.css";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/RegisterPage";
import { useNavigate } from "react-router-dom";

const NavbarNestMart: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("partner_token");
        setIsLoggedIn(!!token); // nếu có token thì đang đăng nhập
    }, []);

    const handleNavigateHome = () => {
        navigate("/partner/home");
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <div className="logo" onClick={() => window.location.href = "http://localhost:3000"} style={{ cursor: 'pointer' }}>
                        <img src="/logo.png" alt="SmartNest Logo" className="logo-image" />
                    </div>

                    <div className="menu-item">
                        <img
                            src="https://flagcdn.com/w40/vn.png"
                            alt="Vietnam Flag"
                            className="flag-icon"
                        />
                        <span>Vietnamese</span>
                        <span className="arrow">▼</span>
                    </div>

                    <div className="menu-item">
                        Hỗ trợ <span className="arrow">▼</span>
                    </div>

                    <div className="menu-item">
                        Hợp tác với chúng tôi <span className="arrow">▼</span>
                    </div>
                    <div>
                        <a
                            className="home-partner"
                            href="http://localhost:3000"
                        >
                            Trang chủ
                        </a>
                    </div>
                </div>
                <div className="navbar-right">
                    {isLoggedIn ? (
                        <button className="btn btn-partner-home" onClick={handleNavigateHome}>
                            Trang quản lý
                        </button>
                    ) : (
                        <>
                            <button className="btn btn-login" onClick={() => setShowLogin(true)}>
                                <FaUser className="icon" />
                                Đăng nhập
                            </button>
                            <button className="btn btn-register" onClick={() => setShowRegister(true)}>
                                Đăng ký
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
            {showRegister && <Register onClose={() => setShowRegister(false)} />}
        </>
    );
};

export default NavbarNestMart;
