import { magnificationToDecibels, formatDecibels, formatPercentage } from '../utils/volumeCalculator';
import type { OutputFormat } from '../types/audio';
import './VolumeControl.css';

interface VolumeControlProps {
    volumeMultiplier: number;
    onVolumeChange: (value: number) => void;
    outputFormat: OutputFormat;
    onFormatChange: (format: OutputFormat) => void;
}

export function VolumeControl({
    volumeMultiplier,
    onVolumeChange,
    outputFormat,
    onFormatChange,
}: VolumeControlProps) {
    const decibels = magnificationToDecibels(volumeMultiplier);

    return (
        <div className="card fade-in">
            <div className="card-header">
                <span className="card-title">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
                    </svg>
                    パラメータ設定
                </span>
            </div>

            <div className="slider-container">
                <div className="slider-label">
                    <span className="slider-label-text">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                        音量ブースト
                    </span>
                    <span className="slider-value">{formatPercentage(volumeMultiplier)}</span>
                </div>

                <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={volumeMultiplier}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="volume-slider"
                />

                <div className="slider-info">
                    <span className="slider-min">10%</span>
                    <span className="slider-db">{formatDecibels(decibels)}</span>
                    <span className="slider-max">500%</span>
                </div>
            </div>

            <div className="format-selector">
                <label className="format-label">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                    出力フォーマット
                </label>
                <select
                    value={outputFormat}
                    onChange={(e) => onFormatChange(e.target.value as OutputFormat)}
                >
                    <option value="wav">WAV（高品質）</option>
                    <option value="mp3">MP3（圧縮）</option>
                </select>
            </div>

            <div className="preset-buttons">
                <span className="preset-label">プリセット:</span>
                <button
                    className="preset-btn"
                    onClick={() => onVolumeChange(1.5)}
                >
                    150%
                </button>
                <button
                    className="preset-btn"
                    onClick={() => onVolumeChange(2)}
                >
                    200%
                </button>
                <button
                    className="preset-btn"
                    onClick={() => onVolumeChange(3)}
                >
                    300%
                </button>
            </div>
        </div>
    );
}
