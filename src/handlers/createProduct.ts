import { APIGatewayProxyHandler } from 'aws-lambda';
import API_RESPONSES from "src/utils/apiResponses";
import { Model } from "../core/model"

export const HANDLER: APIGatewayProxyHandler = async (event) => {

    // checking for the permissions
    const TOKEN = event.headers?.Authorization;
    if (TOKEN == null) {
        return API_RESPONSES._400(null, "error", "missing authentication token");
    }
    const DATA = JSON.parse(event?.body);
    if (!DATA) {
        return API_RESPONSES._400(null, null, "error during the permissions check")
    }
    const MODEL: Model = Model.createModel();
    const RES: boolean = await MODEL.createProduct(DATA, TOKEN);

    console.log(JSON.stringify(RES));

    if (RES)
        return API_RESPONSES._200(null);
    else
        return API_RESPONSES._400(null, null, "error in the creation of the product");
}