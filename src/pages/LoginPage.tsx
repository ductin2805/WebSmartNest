import React, { useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

type LoginPageProps = {
    onClose: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
    const { login, loading, error } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login(username, password);
            alert('Đăng nhập thành công');
            console.log(result);
            if (result?.access_token) {
                localStorage.setItem('partner_token', result.access_token);

                const decodedToken: any = jwtDecode(result.access_token);
                const userId = decodedToken.sub;
                sessionStorage.setItem('user_id', userId);
                console.log('user_id:', userId);
            }

            navigate('/partner/home');
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
                        <label htmlFor="username" className="login-label">Tên đăng nhập hoặc Email</label>
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
                        <label htmlFor="password" className="login-label">Mật khẩu</label>
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
