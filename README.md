# Vibetest - Ionic App

Ionic フレームワークを使用したモバイルアプリ開発プロジェクトです。Android/iOS向けアプリ開発の準備が整っています。

## 技術スタック

- **Ionic Framework** 8.7.2
- **Angular** 18.2.13
- **Capacitor** 6.1.2 (Android/iOS サポート)
- **TypeScript** 5.8.4
- **Node.js** 20.19.4

## プロジェクト構成

```
vibetest/
├── src/                    # ソースコード
│   ├── app/               # Angularアプリ
│   │   ├── home/         # ホームページ
│   │   └── ...
│   ├── assets/           # 静的ファイル
│   ├── theme/            # Ionicテーマ設定
│   └── index.html        # メインHTMLファイル
├── android/              # Androidプロジェクト
├── ios/                  # iOSプロジェクト
├── capacitor.config.ts   # Capacitor設定
├── ionic.config.json     # Ionic設定
└── angular.json          # Angular CLI設定
```

## 開発方法

### 依存関係のインストール
```bash
npm install
```

### 開発サーバーの起動
```bash
npm start
# または
ionic serve
```
ブラウザで `http://localhost:4200` を開いてアプリを確認できます。

### ビルド
```bash
npm run build
# または
ionic build
```

## モバイルアプリ開発

### Android

1. **前提条件**: Android Studio がインストールされていること
2. **プロジェクトを開く**:
   ```bash
   npx cap open android
   ```
3. Android Studioでプロジェクトを開き、ビルド・実行

### iOS

1. **前提条件**: Xcode がインストールされていること（macOS のみ）
2. **プロジェクトを開く**:
   ```bash
   npx cap open ios
   ```
3. XcodeでプロジェクトでiOSをビルド・実行

### ビルドとデプロイ

ウェブアプリの変更をモバイルアプリに反映:
```bash
ionic build
npx cap sync
```

## 主な機能

- ✅ 空のIonicアプリテンプレート
- ✅ Angular 18 + Ionic 8 の最新構成
- ✅ Capacitor によるネイティブ機能アクセス
- ✅ Android/iOS プラットフォーム対応
- ✅ 日本語対応
- ✅ レスポンシブデザイン

## 次のステップ

1. `src/app/home/home.page.html` を編集してアプリのUIを作成
2. 新しいページを追加: `ionic generate page ページ名`
3. ネイティブプラグインの追加（カメラ、位置情報など）
4. PWA機能の追加
5. アプリストアへの公開準備

## 参考リンク

- [Ionic Documentation](https://ionicframework.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Angular Documentation](https://angular.dev)

## トラブルシューティング

### ビルドエラーが発生する場合
```bash
npm install --legacy-peer-deps
```

### キャッシュをクリアする場合
```bash
ionic build --prod
npx cap sync
```