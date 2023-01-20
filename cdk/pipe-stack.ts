import { Stack, Tags } from 'aws-cdk-lib';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import {
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { PipeStackProps } from './types';

export class PipeStack extends Stack {
  constructor(scope: Construct, id: string, props: PipeStackProps) {
    super(scope, id, props);

    if (props.sourceTable.tableStreamArn === undefined) {
      throw new Error('Table stream is not enabled');
    }

    const pipesRole = new Role(this, 'PipesRole', {
      roleName: 'PipesRole',
      assumedBy: new ServicePrincipal('pipes.amazonaws.com'),
      inlinePolicies: {
        PipesDynamoDBStream: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: [
                'dynamodb:DescribeStream',
                'dynamodb:GetRecords',
                'dynamodb:GetShardIterator',
                'dynamodb:ListStreams',
              ],
              resources: [props.sourceTable.tableStreamArn.toString()],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        PipesLambdaExecution: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['lambda:InvokeFunction'],
              resources: [props.enrichmentLambda.functionArn],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        PipesSQSSendMessage: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes'],
              resources: [props.targetQueue.queueArn],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    new CfnPipe(this, 'MessagingPipe', {
      name: 'MessagingPipe',
      roleArn: pipesRole.roleArn,
      source: props.sourceTable.tableStreamArn.toString(),
      sourceParameters: {
        dynamoDbStreamParameters: {
          startingPosition: 'LATEST',
          batchSize: 1,
        },
      },
      enrichment: props.enrichmentLambda.functionArn,
      target: props.targetQueue.queueArn,
    });

    // Add tags to all assets within this stack
    Tags.of(this).add('Stage', 'dev', { priority: 300 });
    Tags.of(this).add('CreatedBy', 'CDK', { priority: 300 });
    Tags.of(this).add('Purpose', 'Example Pipe', { priority: 300 });
    Tags.of(this).add('Owner', 'CDK', { priority: 300 });
  }
}
