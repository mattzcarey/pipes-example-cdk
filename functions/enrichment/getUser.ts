import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { User } from '../types';

const cognito = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});

export const getUser = async (userId: string): Promise<User> => {
  const user = await cognito
    .adminGetUser({
      UserPoolId: process.env.USER_POOL_ID as string,
      Username: userId,
    })
    .promise();

  console.log('user', user);

  const firstName = user.UserAttributes?.find(
    attr => attr.Name === 'given_name',
  )?.Value;

  const lastName = user.UserAttributes?.find(
    attr => attr.Name === 'family_name',
  )?.Value;

  const email = user.UserAttributes?.find(
    attribute => attribute.Name === 'email',
  )?.Value;

  if (firstName == null || lastName == null || email == null) {
    throw new Error('No firstName, lastName or email found');
  }

  return {
    firstName,
    lastName,
    email,
  };
};
