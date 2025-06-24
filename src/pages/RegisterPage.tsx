import React, { useState } from 'react';
import './LoginPage.css'; // Dùng lại CSS của login nếu phù hợp
import { useAuth } from '../hooks/useAuth';

type RegisterPageProps = {
    onClose: () => void;
};

const RegisterPage: React.FC<RegisterPageProps> = ({ onClose }) => {
    const { register, loading, error } = useAuth(); // ✅ dùng hàm register từ hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (password !== confirmPassword) {
            setLocalError('Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            const result = await register({
                firstName,
                lastName,
                username,
                email,
                password
            });
            alert('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
            console.log(result);
            onClose();
        } catch (err) {
            console.error('Lỗi đăng ký:', err);
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-modal">
                <button className="login-close-btn" onClick={onClose}>×</button>
                <h2 className="login-title">Đăng ký</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-group">
                        <label htmlFor="firstName" className="login-label">Họ</label>
                        <input
                            id="firstName"
                            type="text"
                            placeholder="VD: Nguyễn"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <div className="login-group">
                        <label htmlFor="lastName" className="login-label">Tên</label>
                        <input
                            id="lastName"
                            type="text"
                            placeholder="VD: Văn A"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <div className="login-group">
                        <label htmlFor="username" className="login-label">Tên đăng nhập</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <div className="login-group">
                        <label htmlFor="email" className="login-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="youname@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <div className="login-group">
                        <label htmlFor="password" className="login-label">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    <div className="login-group">
                        <label htmlFor="confirmPassword" className="login-label">Xác nhận mật khẩu</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>
                    {(localError || error) && (
                        <p className="login-error">{localError || error}</p>
                    )}
                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
