# cdk-with-localstack

CDKのデプロイをLocalStackに行う検証用リポジトリです。

## 構成

- **CDK**: TypeScriptでDynamoDBテーブルを定義
- **LocalStack**: Docker Composeで最小限の構成
- **GitHub Actions**: CDKのビルドとLocalStackの起動確認

## 必要要件

- Node.js 22以上
- Docker
- Docker Compose
- AWS CLI

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

## CDKスタックの確認

```bash
# スタックの合成（テンプレート生成）
npx cdk synth

# LocalStackにデプロイ（cdklocalを使用）
npx cdklocal deploy --require-approval never
```

**注意**: LocalStackへのCDKデプロイには適切なAWS認証情報の設定が必要です。
`.aws/credentials`ファイルに以下を設定してください：

```ini
[default]
aws_access_key_id = test
aws_secret_access_key = test
```

## LocalStackへの直接デプロイ (AWS CLI)

CDKテンプレートを使用せずに、AWS CLIで直接LocalStackにDynamoDBテーブルを作成：

```bash
aws --endpoint-url=http://localhost:4566 dynamodb create-table \
  --table-name cdk-localstack-table \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1

# テーブルの確認
aws --endpoint-url=http://localhost:4566 dynamodb list-tables --region us-east-1
```

環境変数を設定する場合：
```bash
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
```

## LocalStackの停止

```bash
docker compose down
```

## リソース

- DynamoDBテーブル: `cdk-localstack-table`
  - パーティションキー: `id` (String)