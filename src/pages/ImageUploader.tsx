import React, { useState } from 'react';
import  axiosUploadInstance  from '../api/axiosUploadInstance';
import { toast } from 'react-toastify';

type ImageUploaderProps = {
    postId: string;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ postId }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (!files.length) {
            toast.warning('⚠️ Vui lòng chọn ít nhất một ảnh để tải lên.');
            return;
        }

        setUploading(true);
        try {
            const uploadPromises = files.map((file) => {
                const formData = new FormData();
                formData.append('img_url', file);

                return axiosUploadInstance.post(`/api/v1/images?postId=${postId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            });

            await Promise.all(uploadPromises);
            toast.success('📸 Ảnh đã được tải lên thành công!');
            setFiles([]);
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
            toast.error('❌ Lỗi khi tải ảnh lên.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-uploader">
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
            />
            <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !files.length}
            >
                {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
            </button>
        </div>
    );
};

export default ImageUploader;
