import './DownloadButton.css';

interface DownloadButtonProps {
    isProcessing: boolean;
    isReady: boolean;
    fileName: string;
    onDownload: () => void;
}

export function DownloadButton({
    isProcessing,
    isReady,
    fileName,
    onDownload,
}: DownloadButtonProps) {
    return (
        <div className="download-section fade-in">
            <button
                className="btn btn-primary download-btn"
                onClick={onDownload}
                disabled={!isReady || isProcessing}
            >
                {isProcessing ? (
                    <>
                        <div className="loading-spinner" />
                        処理中...
                    </>
                ) : (
                    <>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                        </svg>
                        変換してダウンロード
                    </>
                )}
            </button>

            {isReady && !isProcessing && (
                <p className="download-info">
                    出力ファイル: <strong>{fileName}</strong>
                </p>
            )}
        </div>
    );
}
