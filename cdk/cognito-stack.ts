import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { UserPool, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

import { buildResourceName } from '../helpers';

export class CognitoStack extends Stack {
  userPool: UserPool;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, buildResourceName('test-user-pool'), {
      userPoolName: buildResourceName('test-user-pool'),
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: 'Verify your email!',
        emailBody:
          'Welcome to my test app! Please verify your email by clicking on the link: {##Verify Email##}',
        emailStyle: VerificationEmailStyle.LINK,
        smsMessage: 'Your OTP is {####}',
      },
      signInAliases: {
        email: true,
        phone: true,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.userPool = userPool;
  }
}
