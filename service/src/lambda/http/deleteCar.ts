import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import "source-map-support/register";
// import { getUserIdFromJwt } from "../../auth/utils";
import { createLogger } from "../../utils/logger";
import { getUserIdFromJwt } from "../../auth/utils";

const logger = createLogger("http");
const docClient = new DynamoDB.DocumentClient();

const CAR_TABLE = process.env.CAR_TABLE;
// const CAR_OWNER_INDEX_NAME = process.env.CAR_OWNER_INDEX_NAME;

/**
 * Get all cars (that have been loaned) for a user
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  const carId = event.pathParameters.carId
  logger.info(`Received request to delete car ${carId}`);

  try {
    logger.info('Getting user id from JWT')
    const ownerId = getUserIdFromJwt(event);

    // Filter for current user and use an INDEX for improved performance
    const params = {
      TableName: CAR_TABLE,
      // IndexName: CAR_OWNER_INDEX_NAME,
      Key: {
        HashKey: carId,
        RangeKey: ownerId // prevents user from deleting someone else's car
      }
    };

    logger.info(`Deleting car ${carId} for owner ${ownerId}`)
    const response = await docClient.delete(params).promise();
    logger.info('completed',{response})

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Credentials': true,
        "Access-Control-Allow-Origin": "*"
      },
      body: ""
    };
    
  } catch (e) {
    // Return FAIL
    logger.error("Unable to delete Car", { e });
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Credentials': true,
        "Access-Control-Allow-Origin": "*"
      },
      body: ""
    };
  }
};
