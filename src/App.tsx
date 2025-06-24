import React from 'react';
import AppRouter from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify'; // ✅ Thêm dòng này
import 'react-toastify/dist/ReactToastify.css'; // ✅ CSS bắt buộc

const App: React.FC = () => {
    return (
        <>
            <AppRouter />
            <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ Thêm ToastContainer */}
        </>
    );
};

export default App;
