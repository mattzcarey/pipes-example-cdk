import { StackProps } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Queue } from 'aws-cdk-lib/aws-sqs';

export interface FunctionsStackProps extends StackProps {
  sourceTable: Table;
  targetQueue: Queue;
  userPool: UserPool;
}

export interface PipeStackProps extends StackProps {
  enrichmentLambda: NodejsFunction;
  sourceTable: Table;
  targetQueue: Queue;
}
