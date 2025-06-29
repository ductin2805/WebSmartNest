// src/components/NavbarPartner.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../pages/PartnerHome.css';
import { toast } from 'react-toastify';

interface Notification {
    id: string;
    userId: string;
    title: string;
    content: string;
    isSeen: boolean;
    createdAt: string;
}

const NavbarPartner: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [hasNewNoti, setHasNewNoti] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('partner_token');
        sessionStorage.removeItem('user_id');
        navigate('/');
    };

    const fetchNotifications = async () => {
        try {
            const userId = sessionStorage.getItem('user_id');
            if (!userId) return;
            const response = await axiosInstance.get(`/notification/user/${userId}`);
            setNotifications(response.data);
        } catch (err) {
            console.error('Lỗi khi lấy thông báo:', err);
        }
    };

    const handleNotificationClick = async (id: string) => {
        try {
            await axiosInstance.put(`/notification/${id}/seen`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isSeen: true } : n))
            );
        } catch (err) {
            console.error('Lỗi khi cập nhật thông báo:', err);
        }
    };

    useEffect(() => {
        fetchNotifications(); // gọi lần đầu

        const intervalId = setInterval(async () => {
            const userId = sessionStorage.getItem('user_id');
            if (!userId) return;

            try {
                const response = await axiosInstance.get(`/notification/user/${userId}`);
                const newData: Notification[] = response.data;

                const latestOldIds = new Set(notifications.map(n => n.id));
                const hasNew = newData.some(n => !latestOldIds.has(n.id));

                if (hasNew) {
                    setNotifications(newData);
                    setHasNewNoti(true); // Đánh dấu có thông báo mới
                    toast.info('🔔 Bạn có thông báo mới!');
                }
            } catch (err) {
                console.error('Lỗi khi kiểm tra thông báo mới:', err);
            }
        }, 30000); // 30 giây

        return () => clearInterval(intervalId);
    }, [notifications]);

    return (
        <header className="partner-home-header">
            <div className="left-section">
                <h1 className="logo">SmartNest</h1>
                <button className="menu-btn" onClick={() => navigate('/partner/home')}>☰ Danh mục</button>
            </div>

            <div className="right-section">
               <span
                   className="icon notification-icon"
                   onClick={() => {
                       setShowNotifications(!showNotifications);
                       setHasNewNoti(false); // reset trạng thái khi mở
                   }}
               >
                🔔 {hasNewNoti && <span className="noti-dot" />}
                </span>
                <span className="icon">🕒</span>
                <span className="icon">❤️</span>
                <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
            </div>

            {showNotifications && (
                <div className="notification-popup">
                    <div className="notification-header">
                        <h4>Thông báo</h4>
                        <button className="close-btn" onClick={() => setShowNotifications(false)}>×</button>
                    </div>
                    <ul className="notification-list">
                        {notifications.map((noti) => (
                            <li
                                key={noti.id}
                                className={`notification-item ${noti.isSeen ? 'seen' : 'unseen'}`}
                                onClick={() => {
                                    handleNotificationClick(noti.id); // Đánh dấu đã xem
                                    navigate(`/partner/notification/${noti.id}`); // Điều hướng tới trang chi tiết
                                }}
                            >
                                <strong>{noti.title}</strong>
                                <p>{noti.content}</p>
                                <small>{new Date(noti.createdAt).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
};

export default NavbarPartner;
