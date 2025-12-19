import { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { AudioPreview } from './components/AudioPreview';
import { VolumeControl } from './components/VolumeControl';
import { DownloadButton } from './components/DownloadButton';
import { useTheme } from './hooks/useTheme';
import { useAudioContext } from './hooks/useAudioContext';
import { decodeAudioFile, adjustVolume, encodeToWav } from './utils/audioProcessor';
import type { OutputFormat } from './types/audio';
import './App.css';

export default function App() {
    const { theme, toggleTheme } = useTheme();
    const { isPlaying, playBuffer, stopPlayback, getContext } = useAudioContext();

    // State
    const [originalBuffer, setOriginalBuffer] = useState<AudioBuffer | null>(null);
    const [processedBuffer, setProcessedBuffer] = useState<AudioBuffer | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [volumeMultiplier, setVolumeMultiplier] = useState<number>(2);
    const [outputFormat, setOutputFormat] = useState<OutputFormat>('wav');
    const [isProcessing, setIsProcessing] = useState(false);
    const [playingOriginal, setPlayingOriginal] = useState(false);

    // 出力ファイル名を計算
    const outputFileName = useMemo(() => {
        if (!fileName) return '';
        const baseName = fileName.replace(/\.[^/.]+$/, '');
        return `${baseName}_boosted.${outputFormat}`;
    }, [fileName, outputFormat]);

    // ファイル選択時の処理
    const handleFileSelect = useCallback(async (file: File) => {
        setIsProcessing(true);
        setOriginalBuffer(null);
        setProcessedBuffer(null);
        stopPlayback();

        try {
            const ctx = getContext();
            const buffer = await decodeAudioFile(file, ctx);
            setOriginalBuffer(buffer);
            setFileName(file.name);

            // 処理済みバッファを生成
            const processed = adjustVolume(buffer, volumeMultiplier);
            setProcessedBuffer(processed);
        } catch (error) {
            console.error('ファイルの読み込みに失敗しました:', error);
            alert('ファイルの読み込みに失敗しました。対応形式のファイルを選択してください。');
        } finally {
            setIsProcessing(false);
        }
    }, [getContext, stopPlayback, volumeMultiplier]);

    // 音量変更時の処理
    const handleVolumeChange = useCallback((value: number) => {
        setVolumeMultiplier(value);

        if (originalBuffer) {
            const processed = adjustVolume(originalBuffer, value);
            setProcessedBuffer(processed);
        }
    }, [originalBuffer]);

    // 元音声の再生
    const handlePlayOriginal = useCallback(() => {
        if (originalBuffer) {
            stopPlayback();
            playBuffer(originalBuffer, 1);
            setPlayingOriginal(true);
        }
    }, [originalBuffer, playBuffer, stopPlayback]);

    // 処理後音声の再生
    const handlePlayProcessed = useCallback(() => {
        if (originalBuffer) {
            stopPlayback();
            playBuffer(originalBuffer, volumeMultiplier);
            setPlayingOriginal(false);
        }
    }, [originalBuffer, playBuffer, stopPlayback, volumeMultiplier]);

    // 再生停止
    const handleStop = useCallback(() => {
        stopPlayback();
    }, [stopPlayback]);

    // ダウンロード処理
    const handleDownload = useCallback(async () => {
        if (!processedBuffer) return;

        setIsProcessing(true);

        try {
            let blob: Blob;

            if (outputFormat === 'wav') {
                blob = encodeToWav(processedBuffer);
            } else {
                // MP3の場合もWAVとして出力（lamejsライブラリなしでの暫定対応）
                blob = encodeToWav(processedBuffer);
                alert('MP3エンコードは現在WAVとして出力されます。');
            }

            // ダウンロードリンクを作成
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = outputFileName.replace('.mp3', '.wav');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('ダウンロードに失敗しました:', error);
            alert('ダウンロードに失敗しました。');
        } finally {
            setIsProcessing(false);
        }
    }, [processedBuffer, outputFormat, outputFileName]);

    return (
        <div className="app">
            <Header theme={theme} onToggleTheme={toggleTheme} />

            <main className="main-content">
                <div className="container">
                    {/* ファイルアップロード */}
                    <FileUploader
                        onFileSelect={handleFileSelect}
                        isProcessing={isProcessing}
                    />

                    {/* 音声プレビュー */}
                    {originalBuffer && (
                        <div className="audio-preview-grid">
                            <AudioPreview
                                title="元の音声"
                                badge="入力"
                                audioBuffer={originalBuffer}
                                isPlaying={isPlaying && playingOriginal}
                                onPlay={handlePlayOriginal}
                                onStop={handleStop}
                            />
                            <AudioPreview
                                title="処理後"
                                badge="処理済"
                                audioBuffer={processedBuffer}
                                isPlaying={isPlaying && !playingOriginal}
                                onPlay={handlePlayProcessed}
                                onStop={handleStop}
                            />
                        </div>
                    )}

                    {/* パラメータ設定 */}
                    {originalBuffer && (
                        <VolumeControl
                            volumeMultiplier={volumeMultiplier}
                            onVolumeChange={handleVolumeChange}
                            outputFormat={outputFormat}
                            onFormatChange={setOutputFormat}
                        />
                    )}

                    {/* ダウンロードボタン */}
                    {originalBuffer && (
                        <DownloadButton
                            isProcessing={isProcessing}
                            isReady={!!processedBuffer}
                            fileName={outputFileName}
                            onDownload={handleDownload}
                        />
                    )}
                </div>
            </main>

            <footer className="footer">
                <p>© 2024 EZVolumeBooster | Made with 💙</p>
            </footer>
        </div>
    );
}
