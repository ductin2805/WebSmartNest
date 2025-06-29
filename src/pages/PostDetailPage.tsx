import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './PostDetailPage.css';
import { FaRulerCombined, FaBed, FaBath, FaLayerGroup, FaGavel, FaHome,  } from 'react-icons/fa';
import { FcMoneyTransfer } from "react-icons/fc";

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

const PostDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const resPost = await axiosInstance.get(`/posts/${id}`);
                const postData = resPost.data;
                setPost(postData);

                const resImg = await axiosInstance.get(`/images/post/${id}`);
                const imgUrls = resImg.data.map((img: any) => `http://localhost:8080${img.imgUrls}`);
                setImages(imgUrls);
                if (imgUrls.length > 0) setSelectedImage(imgUrls[0]);
            } catch (err) {
                console.error('Lỗi tải chi tiết bài đăng:', err);
            }
        };

        fetchData();
    }, [id]);

    if (!post) return <div>Đang tải...</div>;

    return (
        <div className="post-detail-container">
            <div className="post-detail-content">
                <div className="image-section">
                    <div className="main-image-wrapper">
                        <img src={selectedImage} className="main-image" alt="Main" />
                        <span className="image-count">{images.indexOf(selectedImage) + 1}/{images.length}</span>
                    </div>
                    <div className="thumbnail-row">
                        {images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                className={`thumbnail ${img === selectedImage ? 'active' : ''}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>

                <div className="info-section">
                    <h2>{post.title}</h2>
                    <p className="price">
                        <FcMoneyTransfer /> <strong>{post.postDetail.price.toLocaleString('vi-VN')} VND/Tháng</strong> - {post.postDetail.area}m²
                    </p>
                    <p className="address">
                        <FaHome /> {post.address}, {post.ward}, {post.district}, {post.city}
                    </p>

                    <ul className="details-list">
                        <li><FaBed /> Số phòng ngủ: {post.postDetail.bedRoom}</li>
                        <li><FaBath /> Số phòng tắm: {post.postDetail.bathRoom}</li>
                        <li><FaRulerCombined /> Chiều dài: {post.postDetail.length}m</li>
                        <li><FaRulerCombined /> Chiều ngang: {post.postDetail.horizontal}m</li>
                        <li><FaLayerGroup /> Số tầng: {post.postDetail.floor}</li>
                        <li><FaGavel /> Pháp lý: {post.postDetail.legalPapers ? 'Đầy đủ' : 'Không rõ'}</li>
                    </ul>

                    <h3>Tiện ích</h3>
                    <div className="amenities">
                        {post.postDetail.amenities.map(a => (
                            <span key={a.id} className="amenity-badge">{a.name}</span>
                        ))}
                    </div>

                    <h3>Mô tả chi tiết</h3>
                    <p>{post.description}</p>
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;
