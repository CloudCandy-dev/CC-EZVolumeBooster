export interface AudioFile {
    file: File;
    name: string;
    duration: number;
    audioBuffer: AudioBuffer;
}

export interface ProcessedAudio {
    originalBuffer: AudioBuffer;
    processedBuffer: AudioBuffer;
    volumeMultiplier: number;
}

export type OutputFormat = 'wav' | 'mp3';

export type Theme = 'light' | 'dark';
