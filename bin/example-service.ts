#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StackProps } from 'aws-cdk-lib';

import { FunctionsStack } from '../cdk/functions-stack';
import { PipeStack } from '../cdk/pipe-stack';
import { ExampleResourcesStack } from '../cdk/resources-stack';

import { buildResourceName } from '../helpers';
import { CognitoStack } from '../cdk/cognito-stack';

const app = new cdk.App();

const stackProps: StackProps = {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
};

const resourcesStack = new ExampleResourcesStack(
  app,
  buildResourceName('resources-stack'),
  stackProps,
);

const cognitoStack = new CognitoStack(app, buildResourceName('cognito-stack'), {
  ...stackProps,
});

const functionsStack = new FunctionsStack(
  app,
  buildResourceName('functions-stack'),
  {
    ...stackProps,
    sourceTable: resourcesStack.sourceTable,
    targetQueue: resourcesStack.targetQueue,
    userPool: cognitoStack.userPool,
  },
);

new PipeStack(app, buildResourceName('pipe-stack'), {
  ...stackProps,
  enrichmentLambda: functionsStack.enrichmentLambda,
  sourceTable: resourcesStack.sourceTable,
  targetQueue: resourcesStack.targetQueue,
});
