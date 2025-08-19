# Ionic Angular App

このプロジェクトは、Ionic CLIを使用して作成されたblankテンプレートのIonic Angularアプリです。

## 必要条件

- Node.js 16以上
- npm

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. Ionic CLIをグローバルにインストール（まだの場合）:
```bash
npm install -g @ionic/cli
```

## 開発

開発サーバーを起動:
```bash
npm start
# または
ionic serve
```

ブラウザで `http://localhost:4200/` が自動的に開きます。

## ビルド

プロダクション用にビルド:
```bash
npm run build
# または
ionic build
```

ビルドされたファイルは `www/` ディレクトリに保存されます。

## プロジェクト構成

```
src/
  app/
    home/              # ホームページ
    app.component.*    # ルートコンポーネント
    app.module.ts      # アプリモジュール
  theme/
    variables.css      # Ionicテーマ変数
  global.scss          # グローバルスタイル
  index.html          # メインHTMLファイル
  main.ts             # アプリケーションエントリーポイント
```

## 追加情報

- [Ionic Documentation](https://ionicframework.com/docs)
- [Angular Documentation](https://angular.io/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)

このプロジェクトは、Ionic CLIの機能を使用してモバイルアプリとして拡張することができます。