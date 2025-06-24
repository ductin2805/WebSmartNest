import { useState } from 'react';
import { loginApi, registerApi } from '../api/authApi';
import { saveToken } from '../utils/authUtils'; // ✅ import hàm lưu token

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await loginApi(username, password);

            // ✅ Lưu token vào localStorage
            if (data?.token) {
                saveToken(data.token);
            }

            return data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        password: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const data = await registerApi(userData);
            return data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, register, loading, error };
};
