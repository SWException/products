import { APIGatewayProxyHandler } from 'aws-lambda';
import API_RESPONSES from "src/utils/apiResponses";
import { Model } from "../core/model"

export const HANDLER: APIGatewayProxyHandler = async (event) => {

    // checking for the permissions
    const TOKEN = event.headers?.Authorization;
    if (TOKEN == null) {
        return API_RESPONSES._400(null, "error", "missing authentication token");
    }
    const ID = event.pathParameters?.id;
    if (!ID) {
        return API_RESPONSES._400(null, null, "missing product id")
    }
    const MODEL: Model = Model.createModel();
    try{
        const RES: boolean = await MODEL.deleteProduct(ID, TOKEN);
        console.log(JSON.stringify(RES));
        if (RES)
            return API_RESPONSES._200(null);
        else
            return API_RESPONSES._400(null, null, "error while deleting the product");
    }
    catch(err) {
        console.log(err.message);
        return API_RESPONSES._400(null, "error", err.message);
    }
}