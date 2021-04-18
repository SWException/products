import { APIGatewayProxyHandler } from 'aws-lambda';
import API_RESPONSES from "src/utils/apiResponses"
import { Model } from 'src/core/model';

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    // checking for the permissions
    const TOKEN = event.headers?.Authorization;
    if (TOKEN == null) {
        return API_RESPONSES._400(null, "error", "missing authentication token");
    }
    const QUANTITY = event.pathParameters?.quantity as unknown as number;
    if (!QUANTITY) {
        return API_RESPONSES._400(null, "error", "error during the permissions check")
    }
    //check for the id of the product 
    const PRODUCT_ID: string = event.pathParameters?.id;
    if (!PRODUCT_ID) {
        return API_RESPONSES._400(null, null, "id prodotto non presente");
    }

    const MODEL: Model = Model.createModel();
    const RES = await MODEL.changeStock(PRODUCT_ID, QUANTITY, TOKEN);

    console.log(JSON.stringify(RES));

    return API_RESPONSES._200(JSON.parse(JSON.stringify(RES)));
}