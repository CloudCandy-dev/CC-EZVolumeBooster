import { useState, useRef, useCallback } from 'react';

export function useAudioContext() {
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);

    const initContext = useCallback(() => {
        if (!audioContext) {
            const ctx = new AudioContext();
            setAudioContext(ctx);
            return ctx;
        }
        return audioContext;
    }, [audioContext]);

    const playBuffer = useCallback((
        buffer: AudioBuffer,
        volumeMultiplier: number = 1
    ) => {
        const ctx = initContext();

        // 以前の再生を停止
        if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current.disconnect();
        }

        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();

        source.buffer = buffer;
        gainNode.gain.value = volumeMultiplier;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.onended = () => {
            setIsPlaying(false);
        };

        source.start();
        sourceRef.current = source;
        gainRef.current = gainNode;
        setIsPlaying(true);
    }, [initContext]);

    const stopPlayback = useCallback(() => {
        if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        setIsPlaying(false);
    }, []);

    const getContext = useCallback(() => {
        return initContext();
    }, [initContext]);

    return {
        audioContext,
        isPlaying,
        playBuffer,
        stopPlayback,
        getContext,
    };
}
