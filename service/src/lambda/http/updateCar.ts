import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import "source-map-support/register";
import { getUserIdFromJwt } from "../../auth/utils";
import { createLogger } from "../../utils/logger";
const logger = createLogger("http");
const docClient = new DynamoDB.DocumentClient();
const CAR_TABLE = process.env.CAR_TABLE;

/**
 * Updates a CAR
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Received request to update a car");

  try {
    logger.info("Getting user id from JWT");
    const ownerId = getUserIdFromJwt(event);
    const carId = event.pathParameters.carId;
    const { make, model } = JSON.parse(event.body);
    logger.info(
      `Car id ${carId}.  New details will be make ${make}, model ${model}`
    );

    const updateParams = {
      TableName: CAR_TABLE,
      Key: {
        carId,
        ownerId // prevents user from accessing someone else's car
      },
      UpdateExpression: "set make = :make, model=:model",
      ExpressionAttributeValues: {
        ":make": make,
        ":model": model
      }
    };

    logger.info("Performing update");
    await docClient.update(updateParams).promise();

    // Return SUCCESS
    logger.info("Updated Car", { updateParams });
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: null
    };
  } catch (e) {
    // Return FAIL
    logger.error("Unable to create Car", { e });
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: e.message
    };
  }
};
