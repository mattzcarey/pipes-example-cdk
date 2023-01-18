import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import { MessageBody } from '../types';
import { getUser } from './getUser';

export const handler = async (event: DynamoDBStreamEvent): Promise<string> => {
  console.log('event', event);
  const record: DynamoDBRecord = event.Records[0];

  if (record.dynamodb?.NewImage == null || record.dynamodb.OldImage == null) {
    throw new Error('No NewImage or OldImage found');
  }

  const userId = record.dynamodb.NewImage.userId.S;

  if (userId == null) {
    throw new Error('No userId found');
  }

  const user = await getUser(userId);

  const modifiedAttributes: string[] = [];
  for (const key in record.dynamodb.NewImage) {
    if (record.dynamodb.NewImage[key].S !== record.dynamodb.OldImage[key].S) {
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
