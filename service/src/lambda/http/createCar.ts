import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import "source-map-support/register";
import { v4 as uuid } from "uuid";
import { getUserIdFromJwt } from "../../auth/utils";
import { Car } from "../../models/Car";
import { createLogger } from "../../utils/logger";
const logger = createLogger("http");
const docClient = new DynamoDB.DocumentClient();
const CAR_TABLE = process.env.CAR_TABLE;
const BUCKET_NAME = process.env.CAR_PICTURE_S3_BUCKET;

/**
 * Creates a new CAR
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info("Received request to create a car");

  try {
    const { make, model } = JSON.parse(event.body);
    const ownerId = getUserIdFromJwt(event);

    const carId = uuid();
    const newCar: Car = {
      carId,
      ownerId,
      createdAt: new Date().toJSON(),
      make,
      model,
      pictureUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${carId}`
    };

    const params = {
      TableName: CAR_TABLE,
      Item: newCar
    };

    logger.info(`will put into ${params.TableName}`);

    await docClient.put(params).promise();

    // Return SUCCESS
    // with the new car details
    // and a Signed URL for updating the photo
    logger.info("Created Car", { newCar });
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(newCar)
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
