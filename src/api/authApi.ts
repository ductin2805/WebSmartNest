import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';
const REGISTER_API_URL = 'http://localhost:8080/api/v1/auth/register';

export const loginApi = async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
    });
    return response.data;
};

export const registerApi = async (data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}) => {
    const response = await axios.post(REGISTER_API_URL, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};