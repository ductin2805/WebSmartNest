import React, { useState } from 'react';
import './SearchPanel.css';
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // dùng nếu chuyển trang

const tabs = [
    {
        id: 'nhaPho',
        label: 'Nhà phố',
        image: '/icons/iconNhaPho.png',
        subTabs: ['Nhà mặt tiền', 'Biệt thự', 'Nhà phố liền kề'],
    },
    {
        id: 'chungCu',
        label: 'Chung cư',
        image: '/icons/iconChungCu.png',
        subTabs: ['Chung cư cao cấp', 'Chung cư trung cấp', 'Chung cư mini'],
    },
    {
        id: 'canHoDichVu',
        label: 'Căn hộ dịch vụ',
        image: '/icons/iconCanHoDichVu.png',
        subTabs: ['Căn hộ dịch vụ cao cấp', 'Căn hộ dịch vụ mini ', 'Duplex luxury'],
    },
    {
        id: 'phongTro',
        label: 'Phòng trọ',
        image: '/icons/iconPhongTro.png',
        subTabs: ['Phòng trọ sinh viên', 'Phòng trọ gia đình ', 'ký túc xá'],
    },
    {
        id: 'nhaChoThue',
        label: 'Nhà cho thuê',
        image: '/icons/iconNhaChoThue.png',
        subTabs: ['Nhà cấp 4', 'Nhà hẻm ', 'Nhà nhiều tầng'],
    },
];

const SearchBar = () => {
    const [activeTab, setActiveTab] = useState('nhaPho');
    const [activeSubTab, setActiveSubTab] = useState('Nhà mặt tiền');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [handoverTime, setHandoverTime] = useState('');
    const navigate = useNavigate(); // nếu bạn dùng react-router

    const handleSearch = () => {
        const query = {
            type: activeTab,
            subtype: activeSubTab,
            location,
            price,
            handoverTime,
        };
        console.log("🔍 Search query:", query);

        // Nếu bạn muốn chuyển trang với dữ liệu:
        navigate(`/tim-kiem?type=${activeTab}&subtype=${encodeURIComponent(activeSubTab)}&location=${encodeURIComponent(location)}&price=${encodeURIComponent(price)}&handover=${encodeURIComponent(handoverTime)}`);
    };

    const currentTab = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="search-container">
            <div className="main-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`main-tab ${tab.id === activeTab ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab(tab.id);
                            if (tab.subTabs) setActiveSubTab(tab.subTabs[0]);
                        }}
                    >
                        <img src={tab.image} alt={tab.label} className="tab-icon" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {currentTab?.subTabs && (
                <div className="sub-tabs">
                    {currentTab.subTabs.map(sub => (
                        <button
                            key={sub}
                            className={`sub-tab ${sub === activeSubTab ? 'active' : ''}`}
                            onClick={() => setActiveSubTab(sub)}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            )}

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
                            placeholder="Chọn giá căn hộ ví dụ: 10 tỷ đến 20 tỷ"
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
                            placeholder="Chọn thời gian bàn giao ví dụ: tháng 8/2030"
                            value={handoverTime}
                            onChange={(e) => setHandoverTime(e.target.value)}
                        />
                    </div>
                </div>

                <button className="search-button" onClick={handleSearch}>🔍</button>
            </div>
        </div>
    );
};

export default SearchBar;
