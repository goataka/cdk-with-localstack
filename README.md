# cdk-with-localstack

CDKをLocalStackにデプロイする検証用リポジトリ。

## GitHub Actions ワークフロー

本リポジトリでは3つのデプロイパターンを提供しています：

### 1. `deploy-with-setup.yml` (推奨)

**アーキテクチャ**: [setup-localstack](https://github.com/localstack/setup-localstack) GitHub Actionを利用した統合アプローチ

**特徴**:
- LocalStackの起動・停止を自動管理
- `awslocal` CLIの自動インストール
- ヘルスチェックや手動クリーンアップ不要
- CI/CD環境での実行を想定した設計

**推奨理由**: LocalStack公式のアクションにより、セットアップが簡素化され、メンテナンス性が向上します。

### 2. `deploy-with-docker.yml`

**アーキテクチャ**: Docker Composeを利用した従来型アプローチ

**特徴**:
- `docker-compose.yml` を使用して手動でLocalStackを起動
- ヘルスチェックとクリーンアップ（`docker compose down`）を明示的に実行
- ローカル開発環境との一貫性を重視

**適用場面**: Docker Composeの動作を細かく制御したい場合や、ローカル環境と同じ構成をCI/CDで再現したい場合に有用です。

### 3. `deploy-with-testcontainers.yml`

**アーキテクチャ**: [Testcontainers](https://testcontainers.com/)を利用したコンテナ管理アプローチ

**特徴**:
- TypeScriptでTestcontainersライブラリを使用してLocalStackを起動
- `@testcontainers/localstack`パッケージによるプログラマティックなコンテナ管理
- TypeScriptからCDKのブートストラップとデプロイを実行
- 自動的なヘルスチェックとクリーンアップ処理
- Testcontainersエコシステムとの統合

**適用場面**: Testcontainersを既に使用している環境や、TypeScriptでコンテナのライフサイクルを完全に制御したい場合に適しています。

## クイックスタート（ローカル開発）

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

## 注意点

### LocalStackのサービス制限について

`docker-compose.yml`で`SERVICES`環境変数を使ってLocalStackのサービスを制限する場合、`dynamodb`のみに限定しないでください。

**❌ 避けるべき設定例**:
```yaml
environment:
  - SERVICES=dynamodb  # これは動作しません
```

**理由**: `cdklocal`の認証処理ではSTS（Security Token Service）などの追加サービスが必要です。サービスを制限すると、以下のようなわかりづらいエラーが発生します：

```
Unable to resolve AWS account to use. It must be either configured when you define your CDK Stack, or through the environment
```

**推奨**: `SERVICES`環境変数を設定せず、LocalStackのデフォルト設定を使用してください。

## 関連リンク

- [AWS CDK](https://aws.amazon.com/cdk/)
- [LocalStack](https://localstack.cloud/)
- [setup-localstack Action](https://github.com/localstack/setup-localstack)
- [aws-cdk-local](https://github.com/localstack/aws-cdk-local)
- [Testcontainers](https://testcontainers.com/)

## リソース

- DynamoDBテーブル: `cdk-localstack-table`