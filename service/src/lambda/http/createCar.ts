import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
// import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { v4 as uuid } from 'uuid';
import { createLogger } from '../../utils/logger'
const logger = createLogger('http')
import { DynamoDB } from 'aws-sdk';
import { getUserIdFromJwt } from '../../auth/utils';
import { Car } from '../../models/Car';
const docClient = new DynamoDB.DocumentClient();
const CAR_TABLE = process.env.CAR_TABLE


/**
 * Creates a new CAR 
 * @param event 
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('Received request to create a car');

    try {
        const { make, model } = JSON.parse(event.body)
        const ownerId = getUserIdFromJwt(event);
        const newCar: Car = {
            carId: uuid(),
            ownerId,
            createdAt: JSON.stringify(new Date()),
            make,
            model
        }

        const params = {
            TableName: CAR_TABLE,
            Item: newCar
        };

        logger.info(`will put into ${params.TableName}`);

        await docClient.put(params).promise();

        // Return SUCCESS
        logger.info('Created Car', { newCar });
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ item: newCar })
        }
    }
    catch (e) {
        // Return FAIL
        logger.error('Unable to create Car', { e });
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: e.message
        }
    }
}
