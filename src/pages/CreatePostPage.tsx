import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreatePostPage.css';
import axiosInstance from '../api/axiosInstance';
import axiosUploadInstance from '../api/axiosUploadInstance';
import { toast } from 'react-toastify';
import ImageUploader from './ImageUploader';

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
interface Location {
    code: number;
    name: string;
}

const CreatePostPage: React.FC = () => {
    const [cities, setCities] = useState<Location[]>([]);
    const [districts, setDistricts] = useState<Location[]>([]);
    const [wards, setWards] = useState<Location[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [formattedPrice, setFormattedPrice] = useState('');
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
            area: '',
            length: '',
            horizontal: '',
            bedRoom: '',
            bathRoom: '',
            floor: '',
            legalPapers: true,
            amenities: [] as { name: string; description: string }[]
        }
    });

    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/?depth=1')
            .then(res => setCities(res.data))
            .catch(err => console.error('Lỗi tải tỉnh/thành phố:', err));
    }, []);

    useEffect(() => {
        const selectedCity = cities.find((c: any) => c.name === formData.city);
        if (selectedCity) {
            axios.get(`https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`)
                .then(res => setDistricts(res.data.districts))
                .catch(err => console.error('Lỗi tải quận/huyện:', err));
        }
    }, [formData.city]);

    useEffect(() => {
        const selectedDistrict = districts.find((d: any) => d.name === formData.district);
        if (selectedDistrict) {
            axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
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
                    [name]: value
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

    const formatCurrency = (value: string | number): string => {
        const num = typeof value === 'number' ? value : parseInt(value.replace(/\D/g, '')) || 0;
        return num.toLocaleString('vi-VN');
    };

    const unformatCurrency = (value: string): number => {
        return parseInt(value.replace(/\./g, '').replace(/\D/g, '')) || 0;
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCurrency(e.target.value);
        const raw = unformatCurrency(e.target.value);
        setFormData({
            ...formData,
            postDetailRequest: {
                ...formData.postDetailRequest,
                price: raw
            }
        });
        setFormattedPrice(formatted);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const postResponse = await axiosInstance.post('/posts', formData);
            const postId = postResponse.data.id;

            if (files.length > 0) {
                const uploadPromises = files.map(file => {
                    const imgFormData = new FormData();
                    imgFormData.append('img_url', file);

                    return axiosUploadInstance.post(`/api/v1/images?postId=${postId}`, imgFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                });

                await Promise.all(uploadPromises);
                toast.success('🎉 Bài đăng và ảnh đã được tạo thành công!');
            } else {
                toast.success('🎉 Bài đăng đã được tạo (không có ảnh)!');
            }
            setFormData({
                title: '',
                description: '',
                address: '',
                city: '',
                district: '',
                ward: '',
                postType: '',
                postDetailRequest: {
                    price: 0,
                    area: '',
                    length: '',
                    horizontal: '',
                    bedRoom: '',
                    bathRoom: '',
                    floor: '',
                    legalPapers: true,
                    amenities: []
                }
            });
            setFiles([]);
            setFormattedPrice('');
        } catch (err) {
            console.error('Lỗi:', err);
            toast.error('❌ Tạo bài đăng hoặc upload ảnh thất bại!');
        }
    };

    return (
        <div className="create-post-container">
            <h2>Đăng tin bất động sản</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Tiêu đề" value={formData.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} required />

                <select name="city" onChange={handleChange} value={formData.city} required>
                    <option value="">-- Chọn tỉnh/thành phố --</option>
                    {cities.map(city => (
                        <option key={city.code} value={city.name}>{city.name}</option>
                    ))}
                </select>

                <select name="district" onChange={handleChange} value={formData.district} required>
                    <option value="">-- Chọn quận/huyện --</option>
                    {districts.map(district => (
                        <option key={district.code} value={district.name}>{district.name}</option>
                    ))}
                </select>

                <select name="ward" onChange={handleChange} value={formData.ward} required>
                    <option value="">-- Chọn phường/xã --</option>
                    {wards.map(ward => (
                        <option key={ward.code} value={ward.name}>{ward.name}</option>
                    ))}
                </select>

                <input type="text" name="price" placeholder="Giá (VND)" value={formattedPrice} onChange={handlePriceChange} />
                <input type="number" name="area" placeholder="Diện tích (m²)" value={formData.postDetailRequest.area} onChange={handleChange} />
                <input type="text" name="length" placeholder="Chiều dài" value={formData.postDetailRequest.length} onChange={handleChange} />
                <input type="text" name="horizontal" placeholder="Chiều rộng" value={formData.postDetailRequest.horizontal} onChange={handleChange} />
                <input type="number" name="bedRoom" placeholder="Số phòng ngủ" value={formData.postDetailRequest.bedRoom} onChange={handleChange} />
                <input type="number" name="bathRoom" placeholder="Số phòng vệ sinh" value={formData.postDetailRequest.bathRoom} onChange={handleChange} />
                <input type="number" name="floor" placeholder="Số tầng" value={formData.postDetailRequest.floor} onChange={handleChange} />
                <div className="post-type-selector">
                    {[
                        { label: "Nhà phố", value: "HOME", icon: "🏠" },
                        { label: "Chung cư", value: "APARTMENT", icon: "🏢" },
                        { label: "Căn hộ dịch vụ", value: "SERVICE_APT", icon: "🛎️" },
                        { label: "Phòng trọ", value: "RENT_ROOM", icon: "🛏️" },
                        { label: "Nhà cho thuê", value: "FOR_RENT", icon: "🏘️" },
                    ].map((type) => (
                        <button
                            type="button"
                            key={type.value}
                            className={`type-btn ${formData.postType === type.value ? "active" : ""}`}
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    postType: type.value,
                                })
                            }
                        >
                            <span className="icon">{type.icon}</span> {type.label}
                        </button>
                    ))}
                </div>

                <label>
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
                    Pháp lý đầy đủ
                </label>

                <h4>Tiện ích</h4>
                {formData.postDetailRequest.amenities.map((item, idx) => (
                    <div key={idx} className="amenities-group">
                        <input
                            type="text"
                            placeholder="Tên tiện ích"
                            value={item.name}
                            onChange={(e) => handleAmenityChange(idx, 'name', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Mô tả tiện ích"
                            value={item.description}
                            onChange={(e) => handleAmenityChange(idx, 'description', e.target.value)}
                        />
                        <button type="button" onClick={() => removeAmenity(idx)}>Xoá</button>
                    </div>
                ))}
                <button type="button" onClick={addAmenity}>+ Thêm tiện ích</button>

                <h4>📤 Chọn hình ảnh</h4>
                <ImageUploader onFilesSelected={setFiles} />

                <button type="submit" className='create-post-button'>📨 Đăng bài</button>
            </form>
        </div>
    );
};

export default CreatePostPage;
