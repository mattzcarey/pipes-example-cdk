import { DynamoDBRecord } from 'aws-lambda';
import { MessageBody } from '../types';
import { getUser } from './getUser';

export const handler = async (
  dynamoDBStreamEvent: [DynamoDBRecord],
): Promise<string> => {
  console.log('dynamoDBStreamEvent', dynamoDBStreamEvent);
  const event: DynamoDBRecord = dynamoDBStreamEvent[0];

  if (event.dynamodb?.NewImage == null || event.dynamodb.OldImage == null) {
    throw new Error('No NewImage or OldImage found');
  }

  const userId = event.dynamodb.NewImage.userId.S;

  if (userId == null) {
    throw new Error('No userId found');
  }

  const user = await getUser(userId);

  const modifiedAttributes: string[] = [];
  for (const key in event.dynamodb.NewImage) {
    if (event.dynamodb.NewImage[key].S !== event.dynamodb.OldImage[key].S) {
      modifiedAttributes.push(key);
    }
  }

  if (modifiedAttributes.length === 0) {
    throw new Error('No changed parameters found');
  }

  return JSON.stringify({
    ...user,
    modifiedAttributes,
  } as MessageBody);
};
