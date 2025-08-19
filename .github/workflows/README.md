# GitHub Actions CI/CD for Mobile Apps

このリポジトリには、IonicアプリのiOSとAndroidビルド用のGitHub Actionsワークフローが含まれています。

## ワークフロー

### 1. Mobile Build (`mobile-build.yml`)
- **トリガー**: `main`, `develop` ブランチへのプッシュ、および `ionic-app/` フォルダーの変更
- **実行内容**: AndroidとiOSの両方のビルドを並行実行
- **成果物**: デバッグ版APKとiOSアーカイブ

### 2. Android Build (`android-build.yml`)
- **対象**: Android APK/AABの詳細ビルド
- **実行内容**:
  - Node.js依存関係のインストール
  - Webアプリのビルド
  - Capacitorの同期
  - Android APK/AABの生成
  - APKの署名（リリース時）

### 3. iOS Build (`ios-build.yml`)
- **対象**: iOS IPAの詳細ビルド
- **実行内容**:
  - Node.js依存関係のインストール
  - Webアプリのビルド
  - Capacitorの同期
  - CocoaPodsのインストール
  - Xcodeでのビルドとアーカイブ
  - IPAのエクスポート（設定時）

## セットアップ

### 基本設定
1. リポジトリの `.github/workflows/` ディレクトリにワークフローファイルが配置されています
2. `ionic-app/` フォルダー内の変更が検出されると自動的にビルドが開始されます

### Android APK署名の設定（オプション）
リリース版APKに署名するには、以下のリポジトリシークレットを設定してください：

- `ANDROID_KEYSTORE_BASE64`: キーストアファイルをBase64エンコードした文字列
- `ANDROID_KEY_ALIAS`: キーのエイリアス名
- `ANDROID_KEYSTORE_PASSWORD`: キーストアのパスワード
- `ANDROID_KEY_PASSWORD`: キーのパスワード

### iOS IPA署名の設定（オプション）
iOS IPAをエクスポートするには、以下のリポジトリシークレットを設定してください：

- `APPLE_TEAM_ID`: Apple Developer Team ID

**注意**: iOS IPAの完全なエクスポートには、有効なプロビジョニングプロファイルと証明書が必要です。

## ビルド成果物

### Android
- **デバッグAPK**: `android/app/build/outputs/apk/debug/`
- **リリースAPK**: `android/app/build/outputs/apk/release/` （mainブランチのみ）
- **Android App Bundle**: `android/app/build/outputs/bundle/release/` （mainブランチのみ）

### iOS
- **Xcodeアーカイブ**: `ios/App/App.xcarchive`
- **IPA**: `ios/App/build/` （署名設定時のみ）

## 手動実行

各ワークフローは、GitHubのActionsタブから手動で実行することも可能です（`workflow_dispatch` トリガー）。

## トラブルシューティング

### よくある問題

1. **Node.js依存関係のエラー**
   - `package-lock.json` が最新であることを確認
   - Node.jsバージョンが18であることを確認

2. **Android ビルドエラー**
   - Gradle権限の問題: `chmod +x android/gradlew` が実行されているか確認
   - Java 17が使用されているか確認

3. **iOS ビルドエラー**
   - CocoaPodsのインストールに失敗する場合: macOS-latestランナーを使用しているか確認
   - Xcodeプロジェクトの設定を確認

### ログの確認
ビルドが失敗した場合、以下のアーティファクトがアップロードされます：
- Android: `android-build-reports`
- iOS: `ios-build-logs`

## 開発ワークフロー

1. `ionic-app/` フォルダー内でコードを変更
2. `develop` または `main` ブランチにプッシュ
3. GitHub Actionsが自動的にビルドを開始
4. 成果物（APK/IPA）をArtifactsからダウンロード可能

このCI/CDセットアップにより、コードの変更時に自動的にモバイルアプリのビルドが実行され、テスト用のバイナリが生成されます。