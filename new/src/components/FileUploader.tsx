import { useState, useCallback, useRef } from 'react';
import './FileUploader.css';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
}

const ACCEPTED_FORMATS = ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac'];
const ACCEPTED_MIME_TYPES = [
    'audio/mpeg',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/ogg',
    'audio/flac',
    'audio/mp4',
    'audio/aac',
];

export function FileUploader({ onFileSelect, isProcessing }: FileUploaderProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (ACCEPTED_MIME_TYPES.includes(file.type) ||
                ACCEPTED_FORMATS.some(ext => file.name.toLowerCase().endsWith(ext))) {
                onFileSelect(file);
            }
        }
    }, [onFileSelect]);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
        // 同じファイルを再選択できるようにリセット
        e.target.value = '';
    }, [onFileSelect]);

    return (
        <div className="card fade-in">
            <div className="card-header">
                <span className="card-title">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                    </svg>
                    ファイルアップロード
                </span>
            </div>

            <div
                className={`upload-area ${isDragOver ? 'drag-over' : ''} ${isProcessing ? 'disabled' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={isProcessing ? undefined : handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_FORMATS.join(',')}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <div className="upload-icon">
                    {isProcessing ? (
                        <div className="loading-spinner" />
                    ) : (
                        <svg viewBox="0 0 64 64" width="64" height="64">
                            <defs>
                                <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="var(--color-primary)" />
                                    <stop offset="100%" stopColor="var(--color-accent)" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M32 4C18.745 4 8 14.745 8 28c0 9.175 5.233 17.117 12.857 21.028L32 60l11.143-10.972C50.767 45.117 56 37.175 56 28 56 14.745 45.255 4 32 4z"
                                fill="url(#dropGrad)"
                                opacity="0.15"
                            />
                            <path
                                d="M32 8a4 4 0 00-4 4v16h-8a2 2 0 00-1.414 3.414l12 12a2 2 0 002.828 0l12-12A2 2 0 0044 28h-8V12a4 4 0 00-4-4z"
                                fill="url(#dropGrad)"
                            />
                        </svg>
                    )}
                </div>

                <p className="upload-text">
                    {isProcessing ? '処理中...' : 'ここにファイルをドラッグ＆ドロップ'}
                </p>
                <p className="upload-hint">
                    {isProcessing ? 'しばらくお待ちください' : 'またはクリックして選択'}
                </p>

                <p className="upload-formats">
                    対応形式: MP3, WAV, OGG, FLAC, M4A, AAC
                </p>
            </div>
        </div>
    );
}
