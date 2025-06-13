# 水槽ARアプリケーション開発環境

このプロジェクトは、Three.jsとWebXRを活用した水槽ARアプリケーションの開発環境です。React、TypeScript、Viteを基盤とし、効率的な開発ワークフローと高品質なコード管理を実現します。

## 環境構築

### 必要条件

開発を始める前に、以下のソフトウェアがインストールされていることを確認してください：

- Node.js (v18以上)
- npm (v9以上)
- Visual Studio Code

### VS Code 拡張機能

以下の拡張機能をインストールしてください：

- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features

### 初期セットアップ

1. リポジトリのクローン
```bash
git clone [リポジトリURL]
cd aquarium-ar
```

2. 依存パッケージのインストール
```bash
npm install
```

3. 開発サーバーの起動
```bash
npm run dev
```

## 開発ワークフロー

### 日常的な開発作業

1. 開発サーバーの起動:
```bash
npm run dev
```
開発サーバーは http://localhost:3000 で起動します。

2. コードの自動フォーマット:
```bash
npm run format
```
このコマンドは、Prettierを使用してコードを自動的にフォーマットします。基本的には保存時に自動実行されます。

3. リントの実行と修正:
```bash
npm run lint      # リントチェック
npm run lint:fix  # 自動修正可能な問題を修正
```

4. テストの実行:
```bash
npm run test          # テストの実行
npm run test:ui      # UIでテストを実行
npm run test:coverage # カバレッジレポートの生成
```

### ビルドとデプロイ

プロダクション用ビルドの生成:
```bash
npm run build
```

ビルドのプレビュー:
```bash
npm run preview
```

## プロジェクト構造

```
aquarium-ar/
├── src/                     # ソースコードディレクトリ
│   ├── assets/             # 静的ファイル
│   ├── components/         # Reactコンポーネント
│   ├── hooks/             # カスタムフック
│   ├── store/             # 状態管理
│   ├── scenes/            # Three.jsのシーン
│   └── ...
├── .vscode/               # VS Code設定
└── [その他の設定ファイル]
```

## コーディング規約

このプロジェクトでは、以下のコーディング規約を採用しています：

- TypeScriptの厳格なモード使用
- ESLintとPrettierによるコード品質管理
- コンポーネントはTypeScriptの型定義必須
- Import文は絶対パスを使用（src/からの相対パス）

### 自動フォーマット設定

ファイルの保存時に自動的に以下が実行されます：

- Prettierによるコードフォーマット
- ESLintによる自動修正
- TypeScriptの型チェック

## Three.js / WebXR開発のヒント

### シーンの作成

新しいThree.jsのシーンを作成する際は、`src/scenes`ディレクトリ内に配置してください。以下のような構造を推奨します：

```typescript
// src/scenes/ExampleScene.tsx
import { Canvas } from '@react-three/fiber';
import { XR } from '@react-three/xr';

export const ExampleScene = () => {
  return (
    <Canvas>
      <XR>
        {/* シーンの内容 */}
      </XR>
    </Canvas>
  );
};
```

### モデルの追加

3Dモデルは`src/assets/models`ディレクトリに配置し、gLTFフォーマットを使用してください。

## トラブルシューティング

### よくある問題と解決方法

1. TypeScriptのエラー
   - `npm run build`実行時にTypeScriptエラーが発生した場合、`tsconfig.json`の設定を確認してください。
   - 必要に応じて`@types`パッケージをインストールしてください。

2. ESLint/Prettierの競合
   - 設定ファイルの内容を確認してください。
   - 必要に応じて`npm run format`を実行してください。

3. WebXRの動作確認
   - HTTPSが必要です。開発時は自動的に設定されます。
   - モバイルデバイスでのテストには、開発サーバーのIPアドレスを使用してアクセスしてください。

## サポートとコントリビューション

問題や提案がある場合は、GitHubのIssueを作成してください。プルリクエストも歓迎します。

## ライセンス

このプロジェクトは[ライセンス名]の下で公開されています。詳細はLICENSEファイルを参照してください。
