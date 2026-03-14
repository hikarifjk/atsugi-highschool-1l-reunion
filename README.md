# 厚木高校1L+α 同窓会サイト

Astro で作成している同窓会案内サイトです。  
GitHub Pages 配下での公開を前提にしています。

## 主なコマンド

プロジェクトルートで実行します。

| コマンド | 内容 |
| :-- | :-- |
| `npm install` | 依存関係をインストール |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用の静的ファイルを `dist/` に出力 |
| `npm run preview` | ビルド結果をローカル確認 |
| `npm run members:decrypt` | メンバーページの暗号化データをローカル編集用JSONに復元 |
| `npm run members:encrypt` | ローカル編集用JSONから暗号化データを再生成 |

## メンバーページの更新方法

`/members` ページの内容は、そのままの平文では保持せず、暗号化した blob を [src/members-content.blob.json](/home/hfujioka/dev/atsugi-highschool-1l-reunion/src/members-content.blob.json) に保存しています。  
直接 `blob` を編集するのではなく、ローカル編集用JSONを使って更新します。

### 1. ローカル編集用JSONを復元

```bash
MEMBERS_PASSWORD=合言葉 npm run members:decrypt
```

実行すると、`src/members-content.local.json` が作成されます。

### 2. 内容を編集

`src/members-content.local.json` を編集します。

### 3. 暗号化データを再生成

```bash
MEMBERS_PASSWORD=合言葉 npm run members:encrypt
```

実行すると、[src/members-content.blob.json](/home/hfujioka/dev/atsugi-highschool-1l-reunion/src/members-content.blob.json) の暗号化データが更新されます。

### 4. ビルド確認

```bash
npm run build
```

必要に応じて、以下も実行します。

```bash
npm run preview
```

## メンバーページ運用上の注意

- `src/members-content.local.json` は `.gitignore` 対象です。コミットしません。
- [src/members-content.example.json](/home/hfujioka/dev/atsugi-highschool-1l-reunion/src/members-content.example.json) は形式確認用のサンプルです。
- [src/members-content.blob.json](/home/hfujioka/dev/atsugi-highschool-1l-reunion/src/members-content.blob.json) は生成物です。手で編集しません。
- 合言葉は `MEMBERS_PASSWORD` としてコマンド実行時に渡してください。

## 補足

この仕組みは「公開HTMLに平文を出さない」ことを目的にしたもので、完全な秘匿を保証するものではありません。  
公開リポジトリ・静的配信という前提の中で、うっかり見えにくくするための運用です。
