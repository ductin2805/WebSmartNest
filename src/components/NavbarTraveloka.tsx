import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import "./NavbarTraveloka.css";
import LoginPage from "../pages/LoginPage"; // Đường dẫn đúng tới LoginPage.tsx
import Register from "../pages/RegisterPage"

const NavbarTraveloka: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <div className="logo">
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
                </div>

                <div className="navbar-right">
                    <button className="btn btn-login" onClick={() => setShowLogin(true)}>
                        <FaUser className="icon" />
                        Đăng nhập
                    </button>
                    <button className="btn btn-register" onClick={() => setShowRegister(true)}>
                        Đăng ký
                    </button>
                </div>
            </nav>

            {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
            {showRegister && <Register onClose={() => setShowRegister(false)} />}
        </>
    );
};

export default NavbarTraveloka;
