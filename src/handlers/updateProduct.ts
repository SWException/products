import { APIGatewayProxyHandler } from 'aws-lambda';
import API_RESPONSES from "src/utils/apiResponses"
import { Model } from 'src/core/model';

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    // checking for the permissions
    const TOKEN = event.headers?.Authorization;
    if (TOKEN == null) {
        return API_RESPONSES._400(null, "error", "missing authentication token");
    }
    const DATA = JSON.parse(event?.body);
    if (!DATA) {
        return API_RESPONSES._400(null, "error", "error during the permissions check")
    }
    //check for the id of the product 
    const PRODUCT_ID: string = event.pathParameters?.id;
    if (!PRODUCT_ID) {
        return API_RESPONSES._400(null, null, "id prodotto non presente");
    }

    const MODEL: Model = Model.createModel();
    return await MODEL.updateProduct(PRODUCT_ID, DATA, TOKEN)
        .then((RES) => API_RESPONSES._200(JSON.parse(JSON.stringify(RES))))
        .catch((err: Error) => API_RESPONSES._400(err, "error", err.message));
}