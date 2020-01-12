import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import "source-map-support/register";
import { getUserIdFromJwt } from "../../auth/utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("http");
const docClient = new DynamoDB.DocumentClient();

const CAR_TABLE = process.env.CAR_TABLE;
const CAR_OWNER_INDEX_NAME = process.env.CAR_OWNER_INDEX_NAME;

/**
 * Get all cars (that have been loaned) for a user
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (
  event
): Promise<APIGatewayProxyResult> => {
  logger.info("Received request to get all cars for user");

  try {
    logger.info("Getting user id from JWT");
    const ownerId = getUserIdFromJwt(event);

    // Filter for current user and use an INDEX for improved performance
    const params = {
      TableName: CAR_TABLE,
      IndexName: CAR_OWNER_INDEX_NAME,
      KeyConditionExpression: "ownerId = :owner",
      ExpressionAttributeValues: {
        ":owner": ownerId
      }
    };

    logger.info(`Querying cars for user ${ownerId}`);
    const result = await docClient.query(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result.Items)
    };
  } catch (e) {
    // Return FAIL
    logger.error("Unable to create Car", { e });
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*"
      },
      body: e.message
    };
  }
};
