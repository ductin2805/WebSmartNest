import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import './AIChatWidget.css';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AIChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newUserMessage: Message = { sender: 'user', text: input };
        setMessages((prev) => [...prev, newUserMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await axiosInstance.post('/ai', {
                text: input,
                useMemory: false,
                reset: false,
            });

            const summary = res.data.summary;
            const links = res.data.postLinks || [];

            const linkSection = links.length
                ? `\n\nXem chi tiết:\n${links.map((link: any) =>
                    `🔗 <a href="${link.url}" target="_blank">${link.title || link.url}</a>`
                ).join('<br/>')}`
                : '';

            const aiResponse = `${summary}${linkSection}`;
            const newAIMessage: Message = { sender: 'ai', text: aiResponse };
            setMessages((prev) => [...prev, newAIMessage]);
        } catch (error) {
            setMessages((prev) => [...prev, { sender: 'ai', text: 'Đã xảy ra lỗi khi gửi yêu cầu đến AI.' }]);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="chat-toggle" onClick={toggleChat}>
                💬
            </div>
            {isOpen && (
                <div className="chat-box">
                    <div className="chat-history">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}
                                dangerouslySetInnerHTML={{ __html: msg.text }}
                            />
                        ))}
                    </div>
                    <textarea
                        placeholder="Nhập câu hỏi..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={2}
                    />
                    <button onClick={handleSend} disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Gửi'}
                    </button>
                </div>
            )}
        </>
    );
};

export default AIChatWidget;
