import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PartnerHome.css';

const PartnerHome: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xoá token hoặc session nếu có
        localStorage.removeItem('partner_token');
        navigate('/'); // điều hướng về trang đăng nhập
    };

    return (
        <div className="partner-home-container">
            {/* Header */}
            <header className="partner-home-header">
                <h1 className="logo">SmartNest</h1>
                <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
            </header>

            {/* Welcome Section */}
            <main className="main-content">
                <h2 className="welcome-title">Chào mừng đến với trang quản lý của đối tác phòng trọ!</h2>

                <div className="menu-grid">
                    <div className="menu-card" onClick={() => navigate('/partner/posts')}>
                        📋 Quản lý tin đăng
                    </div>
                    <div className="menu-card" onClick={() => navigate('/partner/create')}>
                        ➕ Đăng tin mới
                    </div>
                    <div className="menu-card" onClick={() => navigate('/partner/profile')}>
                        👤 Hồ sơ đối tác
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PartnerHome;
