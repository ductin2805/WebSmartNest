import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './NotificationDetailPage.css';
import axiosInstance from '../api/axiosInstance';

interface NotificationDetail {
    id: string;
    userId: string;
    title: string;
    content: string;
    type: string;
    status: string;
    isSeen: boolean;
    createdAt: string;
    readAt?: string;
}

const NotificationDetailPage: React.FC = () => {
    const { id } = useParams();
    const [notification, setNotification] = useState<NotificationDetail | null>(null);
    const [postImageUrl, setPostImageUrl] = useState<string>('');
    const [postId, setPostId] = useState<string>('');

    useEffect(() => {
        if (!id) return;

        const fetchNotification = async () => {
            try {
                const res = await axiosInstance.get(`/notification/${id}`);
                setNotification(res.data);

                // Trích xuất ID bài viết từ content
                const match = res.data.content.match(/ID\s:\s([a-f0-9-]+)/i);
                if (match && match[1]) {
                    const extractedPostId = match[1];
                    setPostId(extractedPostId);

                    // Lấy ảnh bài viết liên quan
                    const imgRes = await axiosInstance.get(`/images/post/${extractedPostId}`);
                    if (Array.isArray(imgRes.data) && imgRes.data.length > 0) {
                        setPostImageUrl(`http://localhost:8080${imgRes.data[0].imgUrls}`);
                    }
                }
            } catch (err) {
                console.error('Lỗi khi lấy chi tiết thông báo:', err);
            }
        };

        fetchNotification();
    }, [id]);

    if (!notification) return <div>Đang tải...</div>;

    return (
        <div className="notification-detail-container">
            {postImageUrl && (
                <div className="notification-image-wrapper">
                    <img
                        src={postImageUrl}
                        alt="Ảnh bài viết"
                        className="notification-image"
                    />
                </div>
            )}

            <h2>{notification.title}</h2>
            <p><strong>Nội dung:</strong> {notification.content}</p>
            <p><strong>Ngày tạo:</strong> {new Date(notification.createdAt).toLocaleString()}</p>
            {notification.readAt && (
                <p><strong>Đã đọc lúc:</strong> {new Date(notification.readAt).toLocaleString()}</p>
            )}

            {postId && (
                <a
                    href={`http://localhost:3000/posts/${postId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-post-link"
                >
                    👉 Xem chi tiết bài đăng
                </a>
            )}
        </div>
    );
};

export default NotificationDetailPage;
