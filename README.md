# cdk-with-localstack

CDKのデプロイをLocalStackに行う検証用リポジトリです。

## 構成

- **CDK**: TypeScriptでDynamoDBテーブルを定義
- **LocalStack**: Docker Composeで最小限の構成
- **GitHub Actions**: CDKをLocalStackにデプロイ

## 必要要件

- Node.js 22以上
- Docker
- Docker Compose

## セットアップ

```bash
# 依存関係のインストール
npm install

# ビルド
npm run build
```

## LocalStackの起動

```bash
docker compose up -d
```

## CDKデプロイ (LocalStack)

```bash
# 環境変数の設定
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566

# ブートストラップ
npx cdk bootstrap aws://000000000000/us-east-1 --require-approval never

# デプロイ
npx cdk deploy --require-approval never
```

## LocalStackの停止

```bash
docker compose down
```

## リソース

- DynamoDBテーブル: `cdk-localstack-table`
  - パーティションキー: `id` (String)