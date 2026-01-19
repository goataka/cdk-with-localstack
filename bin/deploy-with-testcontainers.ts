#!/usr/bin/env node
import { LocalstackContainer } from "@testcontainers/localstack";
import { execSync } from "child_process";

async function main() {
  console.log("Starting LocalStack with Testcontainers...");
  
  const localstackContainer = await new LocalstackContainer("localstack/localstack:latest")
    .withEnvironment({ DEBUG: "1" })
    .start();

  console.log("LocalStack started successfully!");
  console.log(`LocalStack endpoint: ${localstackContainer.getConnectionUri()}`);

  try {
    // Set environment variables for AWS CLI and CDK
    process.env.AWS_ACCESS_KEY_ID = "test";
    process.env.AWS_SECRET_ACCESS_KEY = "test";
    process.env.AWS_DEFAULT_REGION = "us-east-1";
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
    execSync("npx aws --endpoint-url=" + localstackContainer.getConnectionUri() + " dynamodb list-tables", { 
      stdio: "inherit",
      env: process.env
    });
    
    execSync("npx aws --endpoint-url=" + localstackContainer.getConnectionUri() + " dynamodb describe-table --table-name cdk-localstack-table", { 
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
