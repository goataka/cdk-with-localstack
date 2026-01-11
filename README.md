# cdk-with-localstack

CDKをLocalStackにデプロイする検証用リポジトリ。

## 必要要件

- Node.js 22以上
- Docker & Docker Compose

## クイックスタート

```bash
# 依存関係のインストールとビルド
npm install
npm run build

# LocalStack起動
docker compose up -d

# CDKデプロイ
npx cdklocal deploy --require-approval never

# LocalStack停止
docker compose down
```

## リソース

- DynamoDBテーブル: `cdk-localstack-table`
  - パーティションキー: `id` (String)