/**
 * 倍率からデシベルに変換
 * 既存アプリと同じ計算式: dB = 20 * log10(倍率)
 */
export function magnificationToDecibels(magnification: number): number {
    if (magnification <= 0) return -Infinity;
    return 20 * Math.log10(magnification);
}

/**
 * デシベルから倍率に変換
 */
export function decibelsToMagnification(decibels: number): number {
    return Math.pow(10, decibels / 20);
}

/**
 * デシベル値をフォーマット
 */
export function formatDecibels(decibels: number): string {
    if (!isFinite(decibels)) return '-∞ dB';
    const sign = decibels >= 0 ? '+' : '';
    return `${sign}${decibels.toFixed(1)} dB`;
}

/**
 * 倍率をパーセンテージでフォーマット
 */
export function formatPercentage(magnification: number): string {
    return `${Math.round(magnification * 100)}%`;
}
