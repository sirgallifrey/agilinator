#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AgilinatorStack } from '../lib/agilinator_stack';
import { resolve } from 'path';
import { setAssetsPath } from '../lib/infrastructure/fn_assets_path';

setAssetsPath(resolve(__dirname, "../../../../services/target/lambda"));

const app = new cdk.App();
new AgilinatorStack(app, 'AgilinatorStack', {
  env: { account: process.env.AWS_DEPLOY_ACCOUNT, region: process.env.AWS_DEPLOY_REGION },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});