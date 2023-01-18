import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';

import { buildResourceName } from '../helpers';

export class ExampleResourcesStack extends Stack {
  sourceTable: Table;
  targetQueue: Queue;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, id, {
      tableName: buildResourceName('example-table'),
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      sortKey: { name: 'SK', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
    });

    const queue = new Queue(this, 'ExampleQueue', {
      queueName: buildResourceName('example-queue'),
    });

    this.sourceTable = table;
    this.targetQueue = queue;
  }
}
