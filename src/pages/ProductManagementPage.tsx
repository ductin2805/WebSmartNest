import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './ProductManagementPage.css';

interface Amenity {
    id: string;
    name: string;
    description: string;
}

interface PostDetail {
    price: number;
    area: number;
    length: string;
    horizontal: string;
    bedRoom: number;
    bathRoom: number;
    floor: number;
    legalPapers: boolean;
    amenities: Amenity[];
}

interface Post {
    id: string;
    postDetailId: string;
    userId: string;
    title: string;
    description: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    postType: string;
    status: string;
    createAt: string;
    updatedAt: string;
    postDetail: PostDetail;
}

const ProductManagementPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [postImages, setPostImages] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            const userId = sessionStorage.getItem('user_id');
            if (!userId) return;

            try {
                const res = await axiosInstance.get(`/posts/user/${userId}`);
                setPosts(res.data);

                const imagesMap: Record<string, string[]> = {};
                await Promise.all(
                    res.data.map(async (post: Post) => {
                        try {
                            const resImg = await axiosInstance.get(`/images/post/${post.id}`);
                            const imgUrls = resImg.data.map((img: any) => `http://localhost:8080${img.imgUrls}`);
                            imagesMap[post.id] = imgUrls;
                        } catch (err) {
                            console.error(`Lỗi tải ảnh cho bài đăng ${post.id}:`, err);
                            imagesMap[post.id] = [];
                        }
                    })
                );
                setPostImages(imagesMap);
            } catch (err) {
                console.error('Lỗi khi lấy bài đăng:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDeletePost = async (postId: string) => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xoá bài viết này?");
        if (!confirmed) return;

        try {
            await axiosInstance.delete(`/posts/${postId}`);
            alert("Đã xoá bài viết thành công!");
            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (err) {
            console.error("Lỗi khi xoá bài viết:", err);
            alert("Xoá bài viết thất bại!");
        }
    };

    const handleEditPost = (postId: string) => {
        navigate(`/edit-post/${postId}`);
    };

    const fallbackImage = 'https://via.placeholder.com/400x300';

    return (
        <div className="product-page">
            <h2 className="page-title">Danh sách tin đăng</h2>
            {loading ? (
                <p>Đang tải...</p>
            ) : posts.length === 0 ? (
                <div className="no-posts">
                    <img
                        src="/images/no-posts.png"
                        alt="Không có tin đăng"
                        className="no-posts-image"
                    />
                    <p>Bạn chưa có tin đăng nào.</p>
                </div>
            ) : (
                posts.map((post) => {
                    const imageList = postImages[post.id] || [];
                    const selectedImage = imageList[0] || fallbackImage;
                    return (
                        <div key={post.id} className="product-card" onClick={() => navigate(`/posts/${post.id}`)} style={{ cursor: 'pointer' }}>
                            <div className="product-image">
                                <img src={selectedImage} alt="Ảnh bài đăng" />
                            </div>
                            <div className="product-content">
                                <div className="product-info">
                                    <h3 className="product-title">{post.title}</h3>
                                    <p className="product-price">{(post.postDetail.price / 1000000).toFixed(1)} triệu/tháng</p>
                                    <p>{post.postDetail.area}m² · {post.postDetail.bedRoom} pn · {post.postDetail.bathRoom} wc</p>
                                    <p>{post.address}, {post.ward}, {post.district}, {post.city}</p>
                                    <p>Mã tin: {post.id}</p>
                                    <p>Ngày tạo: {new Date(post.createAt).toLocaleDateString()}</p>
                                    <p>Ngày cập nhật: {new Date(post.updatedAt).toLocaleDateString()}</p>
                                    <p>Tiện ích:</p>
                                    <ul>
                                        {post.postDetail.amenities.map((am) => (
                                            <li key={am.id}>{am.name}: {am.description}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                                    <button className="product-btn" onClick={() => handleEditPost(post.id)}>Sửa tin</button>
                                    <button
                                        className="product-btn danger"
                                        onClick={() => {
                                            const confirmed = window.confirm("Bạn có chắc chắn muốn xoá bài đăng này?");
                                            if (confirmed) handleDeletePost(post.id);
                                        }}
                                    >
                                        Xoá tin
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ProductManagementPage;
