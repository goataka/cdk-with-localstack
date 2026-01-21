#!/usr/bin/env node
import { LocalstackContainer, StartedLocalStackContainer } from "@testcontainers/localstack";
import { execSync } from "child_process";

function runCommand(command: string): void {
  execSync(command, { 
    stdio: "inherit",
    env: process.env
  });
}

async function startLocalStack(): Promise<StartedLocalStackContainer> {
  const container = await new LocalstackContainer("localstack/localstack:latest")
    .withEnvironment({ DEBUG: "1" })
    .start();
  return container;
}

function configureAwsEnvironment(endpoint: string): void {
  process.env.AWS_ACCESS_KEY_ID = "test";
  process.env.AWS_SECRET_ACCESS_KEY = "test";
  process.env.AWS_DEFAULT_REGION = "us-east-1";
  process.env.AWS_ENDPOINT_URL = endpoint;
}

async function main() {
  const localstackContainer = await startLocalStack();

  try {
    const endpoint = localstackContainer.getConnectionUri();
    configureAwsEnvironment(endpoint);
    
    runCommand("npx cdklocal bootstrap");
    runCommand("npx cdklocal deploy --require-approval never");
    runCommand(`npx aws --endpoint-url=${endpoint} dynamodb list-tables`);
    runCommand(`npx aws --endpoint-url=${endpoint} dynamodb describe-table --table-name cdk-localstack-table`);
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
