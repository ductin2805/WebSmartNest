import React, { useState } from 'react';
import './ImageUploader.css';

type ImageUploaderProps = {
    onFilesSelected: (files: File[]) => void;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesSelected }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const allFiles = [...selectedFiles, ...newFiles];
            setSelectedFiles(allFiles);
            onFilesSelected(allFiles);
        }
    };

    const removeImage = (index: number) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault();
        const sourceIndex = Number(e.dataTransfer.getData('text/plain'));
        if (sourceIndex === targetIndex) return;

        const updatedFiles = [...selectedFiles];
        const [movedFile] = updatedFiles.splice(sourceIndex, 1);
        updatedFiles.splice(targetIndex, 0, movedFile);
        setSelectedFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    };

    const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div className="image-uploader">
            <label htmlFor="file-upload" className="upload-box">
                📷 Chọn ảnh (có thể kéo ảnh để sắp xếp, nhấn ❌ để xoá)
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    hidden
                />
            </label>

            <div className="preview-list">
                {selectedFiles.map((file, idx) => (
                    <div
                        key={idx}
                        className="preview-item"
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDrop={(e) => handleDrop(e, idx)}
                        onDragOver={allowDrop}
                    >
                        <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            className="preview-image"
                        />
                        <button
                            type="button"
                            className="remove-button"
                            onClick={() => removeImage(idx)}
                        >
                            ❌
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
