import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '../types/audio';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        // ローカルストレージから取得、なければシステム設定を使用
        const saved = localStorage.getItem('theme') as Theme | null;
        if (saved) return saved;

        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }, []);

    return { theme, setTheme, toggleTheme };
}
