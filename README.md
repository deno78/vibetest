# vibetest
テスト用リポジトリ

[![Mobile Build](https://github.com/deno78/vibetest/actions/workflows/mobile-build.yml/badge.svg)](https://github.com/deno78/vibetest/actions/workflows/mobile-build.yml)

## プロジェクト

### ionic-app
Ionic CLIを使用して作成されたAngularベースのIonicアプリケーション（blankテンプレート）

詳細は [ionic-app/README.md](ionic-app/README.md) を参照してください。

#### 実行方法
```bash
cd ionic-app
npm install
npm start
```

## PWA & GitHub Pages CI/CD

このリポジトリには、
- iOSとAndroidアプリの自動ビルド用のGitHub Actionsワークフローが設定されています。
- PWA（Progressive Web App）としてGitHub Pagesに自動デプロイするCI/CDパイプラインが設定されています。

### 機能

- **PWA対応**: Service Worker、Web App Manifest、オフライン機能
- **自動デプロイ**: main ブランチへのプッシュ時に自動的にGitHub Pagesにデプロイ
- **GitHub Actions**: 完全に自動化されたビルドとデプロイプロセス

### ワークフロー
- **Mobile Build**: AndroidとiOSの並行ビルド
- **Android Build**: Android専用の詳細ビルド（APK/AAB生成）
- **iOS Build**: iOS専用の詳細ビルド（IPA生成）

ワークフローファイル: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

詳細は [.github/workflows/README.md](.github/workflows/README.md) を参照してください。

### 対応プラットフォーム
- ✅ Android APK (デバッグ・リリース)
- ✅ Android App Bundle (AAB)
- ✅ iOS アーカイブ・IPA

### 自動ビルドトリガー
- `main` または `develop` ブランチへのプッシュ
- `ionic-app/` フォルダーの変更
- 手動実行 (workflow_dispatch)

### デプロイされたアプリ

アプリは以下のURLでアクセスできます:
https://deno78.github.io/vibetest/

### CI/CDパイプライン

1. **トリガー**: `main` ブランチへのプッシュ
2. **ビルド**: Node.js環境でIonicアプリをビルド
3. **PWA生成**: Service WorkerとManifestファイルを生成
4. **デプロイ**: GitHub Pagesに静的ファイルをデプロイ

