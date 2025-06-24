import React, { useState } from "react";
import "./ProductSearchPage.css";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";

const mockResults = [
    {
        id: 1,
        title: "Nhà nguyên căn siêu xinh giá rẻ ngay Cộng Hòa",
        address: "Đường Cộng Hòa, Phường 13, Tân Bình",
        price: "5,5 triệu/tháng",
        area: "35m²",
        image: "/sample-room.jpg",
    },
];

const ProductSearchPage: React.FC = () => {
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("10 tỷ");
    const [time, setTime] = useState("Tháng 8/2025");
    const [results, setResults] = useState(mockResults);

    const handleSearch = () => {
        // Gọi API ở đây nếu cần
        setResults(mockResults);
    };

    return (
        <div className="product-page">
            <div className="search-bar-container">
                <div className="search-field">
                    <FaMapMarkerAlt className="search-icon" />
                    <input
                        type="text"
                        placeholder="Phường 15, Cộng Hòa"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div className="search-field">
                    <FaMoneyBillWave className="search-icon" />
                    <input
                        type="text"
                        placeholder="Giá căn hộ"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className="search-field">
                    <FaCalendarAlt className="search-icon" />
                    <input
                        type="text"
                        placeholder="Tháng 8/2025"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>

                <button className="search-button" onClick={handleSearch}>
                    Tìm phòng
                </button>
            </div>

            <div className="search-results">
                {results.map((item) => (
                    <div className="product-card" key={item.id}>
                        <img src={item.image} alt={item.title} />
                        <div className="product-info">
                            <h3>{item.title}</h3>
                            <p>{item.address}</p>
                            <p className="price">
                                {item.price} · {item.area}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSearchPage;
