import { APIGatewayProxyResult } from "aws-lambda";

export const API_RESPONSES = {
    _200: (data: { [key: string]: any },
        status = "success",
        message?: string) => response(200, status, data, message),
    _400: (data: { [key: string]: any },
        status = "error",
        message?: string) => response(400, status, data, message)
}

// c'è export perché attualmente ci sono dei test che testano direttamente questa funzione in apiResponses.test.ts.
export function response (statusCode: number, 
    status: string,
    data: { [key: string]: any },
    message?: string): APIGatewayProxyResult {
    const BODY = {
        status: status
    };
    if (data) {
        BODY['data'] = data;
    }
    if (message) {
        BODY['message'] = message;
    }
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
            'Access-Control-Allow-Headers': '*'
        },
        body: JSON.stringify(BODY, null, 2)
    };
}

export default API_RESPONSES;
