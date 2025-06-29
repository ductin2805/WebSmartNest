import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import './CreatePostPage.css';

interface Ward {
    code: number;
    name: string;
}

interface District {
    code: number;
    name: string;
    wards?: Ward[];
}

interface City {
    code: number;
    name: string;
    districts?: District[];
}

const EditPostPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/?depth=1')
            .then(res => setCities(res.data))
            .catch(err => console.error('Lỗi tải tỉnh/thành phố:', err));
    }, []);

    useEffect(() => {
        if (post?.city) {
            const selectedCity = cities.find(c => c.name === post.city);
            if (selectedCity) {
                axios.get(`https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`)
                    .then(res => setDistricts(res.data.districts))
                    .catch(err => console.error('Lỗi tải quận/huyện:', err));
            }
        }
    }, [post?.city, cities]);

    useEffect(() => {
        if (post?.district) {
            const selectedDistrict = districts.find(d => d.name === post.district);
            if (selectedDistrict) {
                axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
                    .then(res => setWards(res.data.wards))
                    .catch(err => console.error('Lỗi tải phường/xã:', err));
            }
        }
    }, [post?.district, districts]);

    useEffect(() => {
        if (!id) return;

        axiosInstance.get(`http://localhost:8080/api/v1/posts/${id}`)
            .then(res => {
                setPost(res.data);
            })
            .catch(err => {
                console.error('Lỗi khi tải dữ liệu bài viết:', err);
                alert('Không thể tải dữ liệu bài viết.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name in post) {
            setPost({ ...post, [name]: value });
        } else {
            setPost({
                ...post,
                postDetail: {
                    ...post.postDetail,
                    [name]: value
                }
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axiosInstance.put(`http://localhost:8080/api/v1/posts/${id}`, {
                title: post.title,
                description: post.description,
                address: post.address,
                city: post.city,
                district: post.district,
                ward: post.ward,
                postType: post.postType,
                status: post.status,
                updatePostDetailRequest: {
                    price: post.postDetail.price,
                    area: post.postDetail.area,
                    length: post.postDetail.length,
                    horizontal: post.postDetail.horizontal,
                    bedRoom: post.postDetail.bedRoom,
                    bathRoom: post.postDetail.bathRoom,
                    floor: post.postDetail.floor,
                    legalPapers: post.postDetail.legalPapers
                }
            });
            alert('Cập nhật thành công!');
            navigate('/partner/posts');
        } catch (err) {
            console.error('Lỗi cập nhật bài viết:', err);
            alert('Cập nhật thất bại!');
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (!post) return <p>Không tìm thấy bài viết.</p>;

    return (
        <div className="create-post-container">
            <h2>Chỉnh sửa bài viết</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Tiêu đề" value={post.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Mô tả" value={post.description} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Địa chỉ" value={post.address} onChange={handleChange} required />

                <select name="city" value={post.city} onChange={handleChange} required>
                    <option value="">-- Chọn tỉnh/thành phố --</option>
                    {cities.map(city => (
                        <option key={city.code} value={city.name}>{city.name}</option>
                    ))}
                </select>

                <select name="district" value={post.district} onChange={handleChange} required>
                    <option value="">-- Chọn quận/huyện --</option>
                    {districts.map(district => (
                        <option key={district.code} value={district.name}>{district.name}</option>
                    ))}
                </select>

                <select name="ward" value={post.ward} onChange={handleChange} required>
                    <option value="">-- Chọn phường/xã --</option>
                    {wards.map(ward => (
                        <option key={ward.code} value={ward.name}>{ward.name}</option>
                    ))}
                </select>

                <input type="number" name="price" placeholder="Giá (VND)" value={post.postDetail.price} onChange={handleChange} />
                <input type="number" name="area" placeholder="Diện tích (m²)" value={post.postDetail.area} onChange={handleChange} />
                <input type="text" name="length" placeholder="Chiều dài" value={post.postDetail.length} onChange={handleChange} />
                <input type="text" name="horizontal" placeholder="Chiều rộng" value={post.postDetail.horizontal} onChange={handleChange} />
                <input type="number" name="bedRoom" placeholder="Số phòng ngủ" value={post.postDetail.bedRoom} onChange={handleChange} />
                <input type="number" name="bathRoom" placeholder="Số phòng vệ sinh" value={post.postDetail.bathRoom} onChange={handleChange} />
                <input type="number" name="floor" placeholder="Số tầng" value={post.postDetail.floor} onChange={handleChange} />

                <div className="post-type-selector">
                    {[{
                        label: "Nhà phố", value: "HOME", icon: "🏠"
                    }, {
                        label: "Chung cư", value: "APARTMENT", icon: "🏢"
                    }, {
                        label: "Căn hộ dịch vụ", value: "SERVICE_APT", icon: "🛎️"
                    }, {
                        label: "Phòng trọ", value: "RENT_ROOM", icon: "🛏️"
                    }, {
                        label: "Nhà cho thuê", value: "FOR_RENT", icon: "🏘️"
                    }].map(type => (
                        <button
                            type="button"
                            key={type.value}
                            className={`type-btn ${post.postType === type.value ? "active" : ""}`}
                            onClick={() => setPost({ ...post, postType: type.value })}
                        >
                            <span className="icon">{type.icon}</span> {type.label}
                        </button>
                    ))}
                </div>

                <label>
                    <input
                        type="checkbox"
                        name="legalPapers"
                        checked={post.postDetail.legalPapers}
                        onChange={() => setPost({
                            ...post,
                            postDetail: {
                                ...post.postDetail,
                                legalPapers: !post.postDetail.legalPapers
                            }
                        })}
                    />
                    Pháp lý đầy đủ
                </label>

                <button type="submit">📨 Cập nhật</button>
            </form>
        </div>
    );
};

export default EditPostPage;
