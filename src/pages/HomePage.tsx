import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import RoomCard from "./RoomCard";
import "./HomePage.css";

interface PostDetail {
    price: number;
    area: number;
    bedRoom: number;
    bathRoom: number;
}

interface Post {
    id: string;
    title: string;
    address: string;
    ward: string;
    postDetail: PostDetail;
}

interface Room {
    id: string;
    image: string;
    title: string;
    size: string;
    price: string;
    bed: number;
    bath: number;
    location: string;
}

export default function Home() {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosInstance.get("/posts");
                const postsData: Post[] = response.data;

                const imagesMap: Record<string, string> = {};

                await Promise.all(
                    postsData.map(async (post) => {
                        try {
                            const res = await axiosInstance.get(
                                `/images/post/${post.id}`
                            );
                            const imageUrls = res.data.map(
                                (img: any) => `http://localhost:8080${img.imgUrls}`
                            );
                            imagesMap[post.id] = imageUrls[0] || "/images/placeholder.png";
                        } catch (err) {
                            console.error(`Lỗi tải ảnh bài đăng ${post.id}:`, err);
                            imagesMap[post.id] = "/images/placeholder.png";
                        }
                    })
                );

                const mappedRooms: Room[] = postsData.map((post) => ({
                    id: post.id,
                    image: imagesMap[post.id],
                    title: post.title,
                    size: `${post.postDetail.area} m²`,
                    price: `${post.postDetail.price.toLocaleString()} VND/Tháng`,
                    bed: post.postDetail.bedRoom,
                    bath: post.postDetail.bathRoom,
                    location: `${post.ward}, ${post.address}`,
                }));

                setRooms(mappedRooms);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="home-container">
            <div className="home-header">
                <img src="/images/iconCheck.png" alt="check" className="check-icon" />
                <h2 className="header-title">Phòng trọ nổi bật</h2>
            </div>
            <div className="room-list">
                {rooms.slice(0, 4).map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
}
