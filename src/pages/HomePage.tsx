import React from "react";
import "./HomePage.css";
import RoomCard from "./RoomCard";

const rooms = [
    {
        id: 1,
        image: "/images/Room1.png",
        title: "Phòng trọ Tân Bình giá rẻ thích hợp cho sinh viên",
        size: "40m2",
        price: "3,6tr/tháng",
        bed: 1,
        bath: 1,
        location: "Cộng Hòa, Phường 13, Tân Bình",
    },
    {
        id: 2,
        image: "/images/Room2.png",
        title: "Phòng trọ Tân Bình giá rẻ thích hợp cho sinh viên",
        size: "40m2",
        price: "3,6tr/tháng",
        bed: 1,
        bath: 1,
        location: "Cộng Hòa, Phường 13, Tân Bình",
    },
];

export default function Home() {
    return (
        <div className="home-container">
            <div className="home-header">
                <img src="/images/iconCheck.png" alt="check" className="check-icon" />
                <h2 className="header-title">Phòng trọ nổi bật</h2>
            </div>
            <div className="room-list">
                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
}
