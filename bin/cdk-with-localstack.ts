#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkWithLocalstackStack } from '../lib/cdk-with-localstack-stack';

const app = new cdk.App();
new CdkWithLocalstackStack(app, 'CdkWithLocalstackStack');
