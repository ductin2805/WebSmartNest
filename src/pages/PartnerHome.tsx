import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PartnerHome.css';
import NavbarPartner from '../components/NavbarPartner'; // Đường dẫn đúng tuỳ cấu trúc

const PartnerHome: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="partner-home-container">

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
