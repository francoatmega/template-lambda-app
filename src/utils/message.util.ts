import { APIGatewayProxyResult } from 'aws-lambda';

export function createResponse(statusCode: number, message: object): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify(message),
  };
}
