import React from 'react';
import './Footer.css';
import { FaFacebookSquare, FaTiktok, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-column">
                    <img src="/logo.png" alt="SmartNest Logo" className="footer-logo" />
                </div>
                <div className="footer-column">
                    <h3>Về SmartNest</h3>
                    <ul>
                        <li>Cách thức mua bán, thuê nhà</li>
                        <li>Cách liên hệ người đăng tin</li>
                        <li>Cách liên hệ hỗ trợ</li>
                        <li>Hướng dẫn sử dụng an toàn</li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Sản phẩm</h3>
                    <ul>
                        <li>Mua bán căn hộ</li>
                        <li>Cho thuê căn hộ</li>
                        <li>Cho thuê phòng trọ</li>
                        <li>Nhà cho thuê</li>
                        <li>Mua bán chung cư</li>
                    </ul>
                </div>

                <div className="footer-column social">
                    <h3>Theo dõi chúng tôi trên</h3>
                    <ul>
                        <li><FaFacebookSquare className="icon" /> facebook</li>
                        <li><FaTiktok className="icon" /> Tiktok</li>
                        <li><FaYoutube className="icon" /> Youtube</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
