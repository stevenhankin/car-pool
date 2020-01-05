import { APIGatewayProxyHandler,APIGatewayProxyResult } from 'aws-lambda';
// import { createLogger } from '../../utils/logger'
// const logger = createLogger('http')
import 'source-map-support/register';


import { DynamoDB } from 'aws-sdk';
const docClient = new DynamoDB.DocumentClient();


const CAR_TABLE = process.env.CAR_TABLE
const CAR_MAKE_INDEX_NAME = process.env.INDEX_NAME

export const hello: APIGatewayProxyHandler = async (_event, _context): Promise<APIGatewayProxyResult> => {

  // Filter for current user and use an INDEX for improved performance
  const params = {
    TableName: CAR_TABLE,
    IndexName: CAR_MAKE_INDEX_NAME,
    // FilterExpression: 'userId=:u',
    // ExpressionAttributeValues: { ':u': userId }
  };

  const result = await docClient.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
}
