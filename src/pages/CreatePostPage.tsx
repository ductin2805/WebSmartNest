// src/pages/CreatePostPage.tsx
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './CreatePostPage.css';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import ImageUploader from '../pages/ImageUploader';

const CreatePostPage: React.FC = () => {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [createdPostId, setCreatedPostId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        postType: 'HOME',
        postDetailRequest: {
            price: 0,
            area: 0,
            length: '',
            horizontal: '',
            bedRoom: 0,
            bathRoom: 0,
            floor: 0,
            legalPapers: true,
            amenities: [] as { name: string; description: string }[]
        }
    });

    // Lấy danh sách tỉnh/thành phố khi load trang
    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/?depth=1')
            .then(res => setCities(res.data))
            .catch(err => console.error('Lỗi tải tỉnh/thành phố:', err));
    }, []);

    // Lấy danh sách quận/huyện khi chọn thành phố
    useEffect(() => {
        if (formData.city) {
            axios.get(`https://provinces.open-api.vn/api/p/${formData.city}?depth=2`)
                .then(res => setDistricts(res.data.districts))
                .catch(err => console.error('Lỗi tải quận/huyện:', err));
        }
    }, [formData.city]);

    // Lấy danh sách phường/xã khi chọn quận/huyện
    useEffect(() => {
        if (formData.district) {
            axios.get(`https://provinces.open-api.vn/api/d/${formData.district}?depth=2`)
                .then(res => setWards(res.data.wards))
                .catch(err => console.error('Lỗi tải phường/xã:', err));
        }
    }, [formData.district]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name in formData.postDetailRequest) {
            setFormData({
                ...formData,
                postDetailRequest: {
                    ...formData.postDetailRequest,
                    [name]: isNaN(Number(value)) ? value : Number(value)
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const handleAmenityChange = (index: number, field: 'name' | 'description', value: string) => {
        const newAmenities = [...formData.postDetailRequest.amenities];
        newAmenities[index][field] = value;
        setFormData({
            ...formData,
            postDetailRequest: {
                ...formData.postDetailRequest,
                amenities: newAmenities
            }
        });
    };

    const addAmenity = () => {
        setFormData({
            ...formData,
            postDetailRequest: {
                ...formData.postDetailRequest,
                amenities: [...formData.postDetailRequest.amenities, { name: '', description: '' }]
            }
        });
    };

    const removeAmenity = (index: number) => {
        const updatedAmenities = formData.postDetailRequest.amenities.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            postDetailRequest: {
                ...formData.postDetailRequest,
                amenities: updatedAmenities
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Dữ liệu gửi đi:', formData);

        try {
            const response = await axiosInstance.post('/posts', formData);
            const postId = response.data.id;
            setCreatedPostId(postId); // ✅ lưu postId để dùng trong ImageUploader
            toast.success('🎉 Bài đăng đã được tạo thành công!');
        } catch (err: any) {
            console.error('Lỗi khi gửi dữ liệu:', err);
            if (err.response) {
                console.error('Phản hồi từ server:', err.response.data);
            }
            toast.error('❌ Đăng bài thất bại. Vui lòng thử lại!');
        }
    };




    return (
        <div className="create-post-container">
            <h2>Đăng tin bất động sản</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Tiêu đề" onChange={handleChange} required />
                <textarea name="description" placeholder="Mô tả" onChange={handleChange} required />
                <input type="text" name="address" placeholder="Địa chỉ" onChange={handleChange} required />
                <select name="city" onChange={handleChange} required>
                    <option value="">-- Chọn tỉnh/thành phố --</option>
                    {cities.map((city: any) => (
                        <option key={city.code} value={city.code}>
                            {city.name}
                        </option>
                    ))}
                </select>

                <select name="district" onChange={handleChange} required>
                    <option value="">-- Chọn quận/huyện --</option>
                    {districts.map((district: any) => (
                        <option key={district.code} value={district.code}>
                            {district.name}
                        </option>
                    ))}
                </select>

                <select name="ward" onChange={handleChange} required>
                    <option value="">-- Chọn phường/xã --</option>
                    {wards.map((ward: any) => (
                        <option key={ward.code} value={ward.name}>
                            {ward.name}
                        </option>
                    ))}
                </select>

                <input type="number" name="price" placeholder="Giá (VND)" onChange={handleChange} />
                <input type="number" name="area" placeholder="Diện tích (m²)" onChange={handleChange} />
                <input type="text" name="length" placeholder="Chiều dài" onChange={handleChange} />
                <input type="text" name="horizontal" placeholder="Chiều rộng" onChange={handleChange} />
                <input type="number" name="bedRoom" placeholder="Số phòng ngủ" onChange={handleChange} />
                <input type="number" name="bathRoom" placeholder="Số phòng vệ sinh" onChange={handleChange} />
                <input type="number" name="floor" placeholder="Số tầng" onChange={handleChange} />

                <label>Pháp lý:</label>
                <input
                    type="checkbox"
                    checked={formData.postDetailRequest.legalPapers}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            postDetailRequest: {
                                ...formData.postDetailRequest,
                                legalPapers: e.target.checked
                            }
                        })
                    }
                />

                <h4>Tiện ích</h4>
                {formData.postDetailRequest.amenities.map((item, idx) => (
                    <div key={idx} className="amenities-group">
                        <input
                            type="text"
                            placeholder={`Tên tiện ích ${idx + 1}`}
                            value={item.name}
                            onChange={(e) => handleAmenityChange(idx, 'name', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder={`Mô tả tiện ích ${idx + 1}`}
                            value={item.description}
                            onChange={(e) => handleAmenityChange(idx, 'description', e.target.value)}
                        />
                        <button
                            type="button"
                            className="remove-amenity-button"
                            onClick={() => removeAmenity(idx)}
                        >
                            Xoá
                        </button>
                    </div>
                ))}

                <button type="button" className="add-amenity-button" onClick={addAmenity}>
                    + Thêm tiện ích
                </button>

                <button type="submit">Đăng tin</button>
                {createdPostId && (
                    <div style={{ marginTop: '20px' }}>
                        <h4>📤 Tải hình ảnh cho bài đăng:</h4>
                        <ImageUploader postId={createdPostId} />
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreatePostPage;
