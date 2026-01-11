# cdk-with-localstack

CDKをLocalStackにデプロイする検証用リポジトリ。

## 必要要件

- Node.js 22以上
- Docker

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

## GitHub Actions

本リポジトリには2つのワークフローがあります：

- `deploy-with-setup.yml`: [setup-localstack](https://github.com/localstack/setup-localstack)アクションを使用（推奨）
- `deploy-with-docker.yml`: Docker Composeを使用

## リソース

- DynamoDBテーブル: `cdk-localstack-table`