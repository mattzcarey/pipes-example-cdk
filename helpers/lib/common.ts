import { Architecture, FunctionProps, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';
import { getStage } from './getStage';
import { getRegion } from './getRegion';

export const commonLambdaProps: Omit<FunctionProps, 'code'> = {
  runtime: Runtime.NODEJS_16_X,
  handler: 'handler',
  memorySize: 1024,
  architecture: Architecture.ARM_64,
  timeout: Duration.seconds(10),
};

export const commonLambdaEnvironment: Record<string, string> = {
  STAGE: getStage(),
  REGION: getRegion(),
};
