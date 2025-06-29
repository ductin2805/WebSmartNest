import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostList.css';
import axiosInstance from '../api/axiosInstance';

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

const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(price);
};

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [postImages, setPostImages] = useState<Record<string, string[]>>({});
    const fallbackImage = "https://via.placeholder.com/400x300";

    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
            .get('/posts')
            .then(async (response) => {
                const postsData = response.data;
                setPosts(postsData);

                const imagesMap: Record<string, string[]> = {};
                await Promise.all(
                    postsData.map(async (post: Post) => {
                        try {
                            const res = await axiosInstance.get(`http://localhost:8080/api/v1/images/post/${post.id}`);
                            const imgUrls = res.data.map((img: any) => `http://localhost:8080${img.imgUrls}`);
                            imagesMap[post.id] = imgUrls;
                        } catch (err) {
                            console.error(`Lỗi tải ảnh cho bài đăng ${post.id}:`, err);
                            imagesMap[post.id] = [];
                        }
                    })
                );

                setPostImages(imagesMap);
            })
            .catch((error) => console.error('Error fetching posts:', error));
    }, []);



    return (
        <div className="post-list-container">
            <h2 className="post-list-title">Danh sách bài đăng</h2>
            <div className="post-list-grid">
                {posts.map((post) => {
                    const imageList = postImages[post.id] || [];
                    const selectedImage = imageList[0] || fallbackImage;

                    return (
                        <div
                            key={post.id}
                            className="post-list-card"
                            onClick={() => navigate(`/posts/${post.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="post-list-image">
                                <img src={selectedImage} alt="Main" />
                            </div>
                            <div className="post-list-info">
                                <h3 className="post-list-title-text">{post.title}</h3>
                                <p className="post-list-address">
                                    {post.address}, {post.ward}, {post.district}, {post.city}
                                </p>
                                <div className="post-list-amenities">
                                    {post.postDetail.amenities.map((a: Amenity) => (
                                        <span key={a.id} className="post-list-amenity-badge">
                                        {a.name}
                                    </span>
                                    ))}
                                </div>
                                <div className="post-list-price-area">
                                <span className="post-list-price">
                                    {formatCurrency(post.postDetail.price)} / tháng
                                </span>
                                    <span className="post-list-area">
                                    {post.postDetail.area} m²
                                </span>
                                </div>
                            </div>
                            <div
                                className="post-list-fav-button"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button>♡</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PostList;
