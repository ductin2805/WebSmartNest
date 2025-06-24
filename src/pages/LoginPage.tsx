// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom'; // ✅ thêm dòng này

type LoginPageProps = {
    onClose: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
    const { login, loading, error } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // ✅ khởi tạo navigate

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login(username, password);
            alert('Đăng nhập thành công');
            console.log(result);

            // ✅ Ghi token vào localStorage (nếu có)
            if (result?.access_token) {
                localStorage.setItem('partner_token', result.access_token);
            }
            // ✅ Chuyển hướng sau khi đăng nhập
            navigate('/partner/home');

            // Nếu bạn vẫn muốn gọi onClose() để đóng modal:
            // onClose();
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-modal">
                <button className="login-close-btn" onClick={onClose}>×</button>
                <h2 className="login-title">Đăng nhập</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-group">
                        <label htmlFor="username" className="login-label">
                            Tên đăng nhập hoặc Email
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="VD: 0879381170 hoặc youname@gmail.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <div className="login-group">
                        <label htmlFor="password" className="login-label">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Tiếp tục'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
