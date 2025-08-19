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

## CI/CD

このリポジトリには、iOSとAndroidアプリの自動ビルド用のGitHub Actionsワークフローが設定されています。

### ワークフロー
- **Mobile Build**: AndroidとiOSの並行ビルド
- **Android Build**: Android専用の詳細ビルド（APK/AAB生成）
- **iOS Build**: iOS専用の詳細ビルド（IPA生成）

詳細は [.github/workflows/README.md](.github/workflows/README.md) を参照してください。

### 対応プラットフォーム
- ✅ Android APK (デバッグ・リリース)
- ✅ Android App Bundle (AAB)
- ✅ iOS アーカイブ・IPA

### 自動ビルドトリガー
- `main` または `develop` ブランチへのプッシュ
- `ionic-app/` フォルダーの変更
- 手動実行 (workflow_dispatch)
