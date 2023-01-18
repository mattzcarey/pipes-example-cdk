import { SQSEvent } from 'aws-lambda';
import { SES } from 'aws-sdk';

import { MessageBody } from '../types';

const ses = new SES({ apiVersion: '2010-12-01' });

export const handler = async (event: SQSEvent): Promise<SQSEvent> => {
  console.log('event', event);

  const body = JSON.parse(event.Records[0].body) as MessageBody;

  const params: SES.Types.SendEmailRequest = {
    Destination: {
      ToAddresses: [body.email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `Test email body in HTMl. Name: ${body.firstName} ${
            body.lastName
          }.
            You changed the following parameters: ${body.modifiedAttributes.join(
              ', ',
            )}
            If this was not you, please contact support.`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Test email subject',
      },
    },
    // This address must be verified with Amazon SES.
    Source: 'noReply@test.com',
  };

  await ses.sendEmail(params).promise();

  return event;
};
