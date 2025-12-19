import type { Theme } from '../types/audio';
import './Header.css';

interface HeaderProps {
    theme: Theme;
    onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="header-brand">
                        <div className="header-logo">
                            <svg viewBox="0 0 100 100" width="40" height="40">
                                <defs>
                                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="var(--color-primary)" />
                                        <stop offset="100%" stopColor="var(--color-accent)" />
                                    </linearGradient>
                                </defs>
                                <circle cx="50" cy="50" r="45" fill="url(#logoGrad)" />
                                <path d="M35 40 L35 60 L50 60 L65 75 L65 25 L50 40 Z" fill="white" />
                                <path d="M72 35 Q85 50 72 65" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
                                <path d="M78 28 Q95 50 78 72" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="header-title">
                            <h1>EZVolumeBooster</h1>
                            <p className="header-subtitle">音量ブースター</p>
                        </div>
                    </div>

                    <button
                        className="theme-toggle btn btn-icon"
                        onClick={onToggleTheme}
                        aria-label={theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}
                    >
                        {theme === 'light' ? (
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
