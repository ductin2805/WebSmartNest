import React from "react";
import { MapPin, BedDouble, ShowerHead } from "lucide-react";

interface Room {
    id: number;
    image: string;
    title: string;
    size: string;
    price: string;
    bed: number;
    bath: number;
    location: string;
}

const RoomCard = ({ room }: { room: Room }) => {
    return (
        <div className="room-card">
            <img src={room.image} alt={room.title} className="room-image" />
            <div className="room-info">
                <h3 className="room-title">{room.title}</h3>
                <div className="room-details">
                    <span className="room-size">{room.size}</span>
                    <span className="room-price">{room.price}</span>
                    <span className="room-icon">
            <ShowerHead size={16} /> {room.bath}
          </span>
                    <span className="room-icon">
            <BedDouble size={16} /> {room.bed}
          </span>
                    <span className="room-icon">
            <MapPin size={16} /> {room.location}
          </span>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
