export const saveToken = (token: string) => {
    localStorage.setItem('partner_token', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('partner_token');
};

export const removeToken = () => {
    localStorage.removeItem('partner_token');
};
