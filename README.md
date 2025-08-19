# vibetest
テスト用リポジトリ

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

このリポジトリには、Ionic アプリをPWA（Progressive Web App）としてGitHub Pagesに自動デプロイするCI/CDパイプラインが設定されています。

### 機能

- **PWA対応**: Service Worker、Web App Manifest、オフライン機能
- **自動デプロイ**: main ブランチへのプッシュ時に自動的にGitHub Pagesにデプロイ
- **GitHub Actions**: 完全に自動化されたビルドとデプロイプロセス

### デプロイされたアプリ

アプリは以下のURLでアクセスできます:
https://deno78.github.io/vibetest/

### CI/CDパイプライン

1. **トリガー**: `main` ブランチへのプッシュ
2. **ビルド**: Node.js環境でIonicアプリをビルド
3. **PWA生成**: Service WorkerとManifestファイルを生成
4. **デプロイ**: GitHub Pagesに静的ファイルをデプロイ

ワークフローファイル: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
