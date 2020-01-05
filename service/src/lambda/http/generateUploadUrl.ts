import 'source-map-support/register'
import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

/**
 * Returns a signed URL to upload a file
 * directly into an S3 bucket
 * for a CAR item with the provided id
 * @param event 
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const carId = event.pathParameters.carId
  const s3 = new AWS.S3({ signatureVersion: 'v4' });
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: process.env.FILE_UPLOAD_S3_BUCKET,
    Key: carId,
    Expires: 600 // Expires in 600s
  })
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ uploadUrl })
  }
}


