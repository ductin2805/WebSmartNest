import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Đảm bảo file App.tsx có trong cùng thư mục src

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
