# EZVolumeBooster

音声ファイルの音量を簡単に増幅するWebアプリケーション

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎵 特徴

- **サーバーレス** - すべての処理がブラウザ内で完結
- **ドラッグ＆ドロップ対応** - ファイルを選択するだけで簡単操作
- **Ctrl+V貼り付け** - クリップボードから直接読み込み可能
- **リアルタイムプレビュー** - 波形表示と再生機能
- **複数の出力形式** - WAV / WebM / MP3 に対応
- **クリッピング警告** - 音量を上げすぎた場合に警告表示
- **ダーク/ライトモード** - 見やすいテーマ切り替え

## 🚀 使い方

### オンラインで使う
`standalone.html` をウェブサーバーにアップロードするか、直接ブラウザで開くだけ！

### ローカルで使う
1. `standalone.html` をダブルクリック
2. 音声ファイルをドラッグ＆ドロップ（または選択 / Ctrl+V）
3. スライダーで音量を調整（10%〜500%）
4. 出力形式を選択
5. 「変換してダウンロード」をクリック

## 📁 対応形式

### 入力
MP3, WAV, OGG, FLAC, M4A, AAC

### 出力
| 形式 | 説明 |
|------|------|
| WAV | 高品質・無圧縮 |
| WebM | 高品質・圧縮 |
| MP3 | 互換性重視（要インターネット接続） |

## 🛠️ 技術スタック

- HTML5 / CSS3 / JavaScript
- Web Audio API（音声処理）
- MediaRecorder API（WebMエンコード）
- [lamejs](https://github.com/zhuker/lamejs)（MP3エンコード）

## 📦 ファイル構成

```
CC-EZVolumeBooster/
├── standalone.html    # メインアプリ（これだけで動作）
├── old/               # 旧バージョン（Python/Flet）
└── README.md
```

## 🎨 デザイン

水色基調の清涼感あるデザイン（ラムネソーダ・空・海をイメージ）

## 📄 ライセンス

MIT License

## 🔗 関連リンク

- [GitHub Pages でデプロイする方法](https://docs.github.com/ja/pages)
- [Web Audio API ドキュメント](https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API)
