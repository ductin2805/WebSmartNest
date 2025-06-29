import React, { useState } from 'react';
import './SearchPanel.css';
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const tabs = [
    {
        id: 'nhaPho',
        label: 'Nhà phố',
        image: '/icons/iconNhaPho.png',
        value: 'HOME',
        subTabs: [
            { label: 'Nhà mặt tiền', value: 'HOME_FACE' },
            { label: 'Biệt thự', value: 'BULDING' },
            { label: 'Nhà phố liền kề', value: 'LIEN_KE' },
        ],
    },
    {
        id: 'chungCu',
        label: 'Chung cư',
        image: '/icons/iconChungCu.png',
        value: 'APARTMENT',
        subTabs: [
            { label: 'Chung cư cao cấp', value: 'CAO_CAP' },
            { label: 'Chung cư trung cấp', value: 'TRUNG_CAP' },
            { label: 'Chung cư mini', value: 'MINI' },
        ],
    },
    {
        id: 'canHoDichVu',
        label: 'Căn hộ dịch vụ',
        image: '/icons/iconCanHoDichVu.png',
        value: 'SERVICE_APT',
        subTabs: [
            { label: 'Căn hộ dịch vụ cao cấp', value: 'CAO_CAP' },
            { label: 'Căn hộ dịch vụ mini', value: 'MINI' },
            { label: 'Duplex luxury', value: 'DUPLEX' },
        ],
    },
    {
        id: 'phongTro',
        label: 'Phòng trọ',
        image: '/icons/iconPhongTro.png',
        value: 'RENT_ROOM',
        subTabs: [
            { label: 'Phòng trọ sinh viên', value: 'SV' },
            { label: 'Phòng trọ gia đình', value: 'GD' },
            { label: 'Ký túc xá', value: 'KTX' },
        ],
    },
    {
        id: 'nhaChoThue',
        label: 'Nhà cho thuê',
        image: '/icons/iconNhaChoThue.png',
        value: 'FOR_RENT',
        subTabs: [
            { label: 'Nhà cấp 4', value: 'CAP_4' },
            { label: 'Nhà hẻm', value: 'HEM' },
            { label: 'Nhà nhiều tầng', value: 'NHIU_TANG' },
        ],
    },
];

const SearchBar = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [activeSubTab, setActiveSubTab] = useState(tabs[0].subTabs[0]);
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [handoverTime, setHandoverTime] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate('/posts');
    };

    return (
        <div className="search-container">
            <div className="main-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`main-tab ${tab.id === activeTab.id ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab(tab);
                            setActiveSubTab(tab.subTabs[0]);
                        }}
                    >
                        <img src={tab.image} alt={tab.label} className="tab-icon" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="sub-tabs">
                {activeTab.subTabs.map((sub) => (
                    <button
                        key={sub.value}
                        className={`sub-tab ${sub.value === activeSubTab.value ? 'active' : ''}`}
                        onClick={() => setActiveSubTab(sub)}
                    >
                        {sub.label}
                    </button>
                ))}
            </div>

            <div className="search-fields">
                <div className="input-group-wrapper">
                    <label className="field-label">Chọn địa điểm hoặc tên căn hộ:</label>
                    <div className="input-group">
                        <FaMapMarkerAlt className="icon" />
                        <input
                            type="text"
                            placeholder="Phường, quận , thành phố hoặc dự án"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </div>
                <div className="input-group-wrapper">
                    <label className="field-label">Giá căn hộ:</label>
                    <div className="input-group">
                        <FaMoneyBillWave className="icon" />
                        <input
                            type="text"
                            placeholder="VD: 5 triệu đến 10 triệu"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>
                <div className="input-group-wrapper">
                    <label className="field-label">Thời gian bàn giao:</label>
                    <div className="input-group">
                        <FaCalendarAlt className="icon" />
                        <input
                            type="text"
                            placeholder="VD: tháng 12/2025"
                            value={handoverTime}
                            onChange={(e) => setHandoverTime(e.target.value)}
                        />
                    </div>
                </div>

                <button className="search-button" onClick={handleSearch}>
                    🔍
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
