import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfilePage.css';
import axiosInstance from '../api/axiosInstance';

interface UserUpdateRequest {
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const UserProfilePage: React.FC = () => {
    const [formData, setFormData] = useState<UserUpdateRequest>({
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });
    const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [activeForm, setActiveForm] = useState<'profile' | 'password'>('profile');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get('/users');
            const data = response.data;

            setFormData({
                username: data.preferred_username || '',
                firstName: data.name?.split(' ').slice(0, -1).join(' ') || '',
                lastName: data.name?.split(' ').slice(-1).join(' ') || '',
                phoneNumber: data.phoneNumber || '',
            });
        } catch (err) {
            console.error('Lỗi khi lấy thông tin người dùng:', err);
            setError('Không thể tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        const userId = sessionStorage.getItem('user_id');
        if (!userId) {
            alert('Không tìm thấy user_id!');
            return;
        }

        try {
            await axiosInstance.put(`http://localhost:8080/api/v1/users/${userId}`, formData);
            alert('Cập nhật thông tin thành công!');
        } catch (err) {
            console.error('Lỗi cập nhật:', err);
            alert('Cập nhật thất bại!');
        }
    };

    const handleChangePassword = async () => {
        try {
            await axiosInstance.put(
                `http://localhost:8080/api/v1/users/change-password?username=${formData.username}`,
                passwordData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            alert('Đổi mật khẩu thành công!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error('Lỗi đổi mật khẩu:', err);
            alert('Đổi mật khẩu thất bại!');
        }
    };

    if (loading) return <div className="user-profile-container">Đang tải...</div>;
    if (error) return <div className="user-profile-container error">{error}</div>;

    return (
        <div>
            <div className="form-switcher">
                <button onClick={() => setActiveForm('profile')} className={activeForm === 'profile' ? 'active' : ''}>
                    Thông tin cá nhân
                </button>
                <button onClick={() => setActiveForm('password')} className={activeForm === 'password' ? 'active' : ''}>
                    Đổi mật khẩu
                </button>
            </div>

            <div className="user-profile-container">
                <h2>{activeForm === 'profile' ? 'Cập nhật thông tin người dùng' : 'Đổi mật khẩu'}</h2>
                <div className="user-profile-form">
                    {activeForm === 'profile' ? (
                        <>
                            <div className="form-group">
                                <label htmlFor="username">Tên đăng nhập</label>
                                <input type="text" id="username" value={formData.username} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstName">Họ</label>
                                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Tên</label>
                                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Số điện thoại</label>
                                <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                            </div>
                            <button className="save-btn" onClick={handleSave}>Lưu thay đổi</button>
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label htmlFor="oldPassword">Mật khẩu cũ</label>
                                <input type="password" id="oldPassword" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="newPassword">Mật khẩu mới</label>
                                <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                            </div>
                            <button className="save-btn" onClick={handleChangePassword}>Đổi mật khẩu</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
