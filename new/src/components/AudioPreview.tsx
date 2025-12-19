import { useRef, useEffect, useCallback } from 'react';
import { formatDuration } from '../utils/audioProcessor';
import './AudioPreview.css';

interface AudioPreviewProps {
    title: string;
    badge: string;
    audioBuffer: AudioBuffer | null;
    isPlaying: boolean;
    onPlay: () => void;
    onStop: () => void;
}

export function AudioPreview({
    title,
    badge,
    audioBuffer,
    isPlaying,
    onPlay,
    onStop,
}: AudioPreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 波形を描画
    const drawWaveform = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !audioBuffer) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;

        // 背景をクリア
        ctx.clearRect(0, 0, width, height);

        // 波形データを取得（モノラルに変換）
        const channelData = audioBuffer.getChannelData(0);
        const samples = channelData.length;
        const samplesPerPixel = Math.floor(samples / width);

        // グラデーションを作成
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const style = getComputedStyle(document.documentElement);
        const primaryColor = style.getPropertyValue('--color-primary').trim();
        const accentColor = style.getPropertyValue('--color-accent').trim();
        gradient.addColorStop(0, primaryColor || '#00b4d8');
        gradient.addColorStop(1, accentColor || '#0096c7');

        ctx.fillStyle = gradient;
        ctx.beginPath();

        const centerY = height / 2;

        for (let x = 0; x < width; x++) {
            const start = x * samplesPerPixel;
            const end = start + samplesPerPixel;

            let min = 0;
            let max = 0;

            for (let i = start; i < end && i < samples; i++) {
                const sample = channelData[i];
                if (sample < min) min = sample;
                if (sample > max) max = sample;
            }

            const minY = centerY + min * centerY * 0.9;
            const maxY = centerY + max * centerY * 0.9;

            ctx.fillRect(x, minY, 1, maxY - minY || 1);
        }
    }, [audioBuffer]);

    useEffect(() => {
        drawWaveform();

        const handleResize = () => drawWaveform();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [drawWaveform]);

    return (
        <div className="card audio-preview-card fade-in">
            <div className="card-header">
                <span className="card-title">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                    {title}
                </span>
                <span className="card-badge">{badge}</span>
            </div>

            <div className="waveform-container">
                {audioBuffer ? (
                    <canvas ref={canvasRef} className="waveform-canvas" />
                ) : (
                    <div className="waveform-placeholder">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" opacity="0.3">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                        <span>ファイルを選択してください</span>
                    </div>
                )}
            </div>

            {audioBuffer && (
                <div className="audio-info">
                    <span className="audio-duration">
                        {formatDuration(audioBuffer.duration)}
                    </span>
                    <span className="audio-meta">
                        {audioBuffer.sampleRate / 1000}kHz • {audioBuffer.numberOfChannels === 1 ? 'モノラル' : 'ステレオ'}
                    </span>
                </div>
            )}

            <div className="audio-controls">
                <button
                    className="btn btn-secondary"
                    onClick={isPlaying ? onStop : onPlay}
                    disabled={!audioBuffer}
                >
                    {isPlaying ? (
                        <>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                            停止
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            再生
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
