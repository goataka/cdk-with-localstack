#!/usr/bin/env node
import { LocalstackContainer } from "@testcontainers/localstack";
import { execSync } from "child_process";

// Configuration constants
const LOCALSTACK_IMAGE = "localstack/localstack:latest";
const AWS_ACCESS_KEY_ID = "test";
const AWS_SECRET_ACCESS_KEY = "test";
const AWS_DEFAULT_REGION = "us-east-1";
const TABLE_NAME = "cdk-localstack-table";

async function main() {
  console.log("Starting LocalStack with Testcontainers...");
  
  const localstackContainer = await new LocalstackContainer(LOCALSTACK_IMAGE)
    .withEnvironment({ DEBUG: "1" })
    .start();

  console.log("LocalStack started successfully!");
  console.log(`LocalStack endpoint: ${localstackContainer.getConnectionUri()}`);

  try {
    // Set environment variables for AWS CLI and CDK
    process.env.AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY;
    process.env.AWS_DEFAULT_REGION = AWS_DEFAULT_REGION;
    process.env.AWS_ENDPOINT_URL = localstackContainer.getConnectionUri();

    console.log("\nBootstrapping CDK...");
    execSync("npx cdklocal bootstrap", { 
      stdio: "inherit",
      env: process.env
    });

    console.log("\nDeploying CDK stack...");
    execSync("npx cdklocal deploy --require-approval never", { 
      stdio: "inherit",
      env: process.env
    });

    console.log("\nVerifying deployment...");
    const endpoint = localstackContainer.getConnectionUri();
    execSync(`npx aws --endpoint-url=${endpoint} dynamodb list-tables`, { 
      stdio: "inherit",
      env: process.env
    });
    
    execSync(`npx aws --endpoint-url=${endpoint} dynamodb describe-table --table-name ${TABLE_NAME}`, { 
      stdio: "inherit",
      env: process.env
    });

    console.log("\nDeployment completed successfully!");
  } catch (error) {
    console.error("Error during deployment:", error);
    throw error;
  } finally {
    console.log("\nStopping LocalStack...");
    await localstackContainer.stop();
    console.log("LocalStack stopped.");
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
