#!/usr/bin/env node
import { LocalstackContainer, StartedLocalStackContainer } from "@testcontainers/localstack";
import { execSync } from "child_process";

// Configuration constants
const LOCALSTACK_IMAGE = "localstack/localstack:latest";
const AWS_ACCESS_KEY_ID = "test";
const AWS_SECRET_ACCESS_KEY = "test";
const AWS_DEFAULT_REGION = "us-east-1";
const TABLE_NAME = "cdk-localstack-table";

async function startLocalStack(): Promise<StartedLocalStackContainer> {
  const container = await new LocalstackContainer(LOCALSTACK_IMAGE)
    .withEnvironment({ DEBUG: "1" })
    .start();
  return container;
}

function configureAwsEnvironment(endpoint: string): void {
  process.env.AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID;
  process.env.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY;
  process.env.AWS_DEFAULT_REGION = AWS_DEFAULT_REGION;
  process.env.AWS_ENDPOINT_URL = endpoint;
}

function bootstrapCdk(): void {
  execSync("npx cdklocal bootstrap", { 
    stdio: "inherit",
    env: process.env
  });
}

function deployCdk(): void {
  execSync("npx cdklocal deploy --require-approval never", { 
    stdio: "inherit",
    env: process.env
  });
}

function verifyDeployment(endpoint: string): void {
  execSync(`npx aws --endpoint-url=${endpoint} dynamodb list-tables`, { 
    stdio: "inherit",
    env: process.env
  });
  
  execSync(`npx aws --endpoint-url=${endpoint} dynamodb describe-table --table-name ${TABLE_NAME}`, { 
    stdio: "inherit",
    env: process.env
  });
}

async function main() {
  const localstackContainer = await startLocalStack();

  try {
    const endpoint = localstackContainer.getConnectionUri();
    configureAwsEnvironment(endpoint);
    bootstrapCdk();
    deployCdk();
    verifyDeployment(endpoint);
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  } finally {
    await localstackContainer.stop();
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
