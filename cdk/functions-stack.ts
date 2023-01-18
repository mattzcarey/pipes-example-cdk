import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { FunctionsStackProps } from './types';

import {
  buildResourceName,
  commonLambdaEnvironment,
  commonLambdaProps,
} from '../helpers/index';

export class FunctionsStack extends Stack {
  enrichmentLambda: NodejsFunction;
  emailLambda: NodejsFunction;

  constructor(scope: Construct, id: string, props: FunctionsStackProps) {
    super(scope, id, props);

    const enrichmentLambda = new NodejsFunction(
      this,
      buildResourceName('enrichment-lambda'),
      {
        functionName: buildResourceName('enrichment'),
        entry: join(__dirname, '../functions/enrichment/index.ts'),
        ...commonLambdaProps,
        environment: {
          ...commonLambdaEnvironment,
          USER_POOL_ID: props.userPool.userPoolId,
        },
      },
    );

    enrichmentLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['cognito-idp:AdminGetUser'],
        resources: [props.userPool.userPoolArn],
      }),
    );

    const emailLambda = new NodejsFunction(
      this,
      buildResourceName('email-lambda'),
      {
        functionName: buildResourceName('email'),
        entry: join(__dirname, '../functions/email/index.ts'),
        ...commonLambdaProps,
        environment: {
          ...commonLambdaEnvironment,
        },
      },
    );

    emailLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['ses:SendEmail'],
        resources: ['*'],
      }),
    );

    const eventSource = new SqsEventSource(props.targetQueue, {
      batchSize: 1,
    });

    emailLambda.addEventSource(eventSource);

    this.enrichmentLambda = enrichmentLambda;
    this.emailLambda = emailLambda;
  }
}
