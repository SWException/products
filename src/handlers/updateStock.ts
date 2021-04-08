import { APIGatewayProxyHandler } from 'aws-lambda';
import { Model } from 'src/core/model';
import API_RESPONSES from "src/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const DATA = JSON.parse(event?.body); // filtri o ordinamento o pagina
    const MODEL: Model = Model.createModel();
    
    const PRODUCT_ID: string = event.pathParameters?.id;
    if (!PRODUCT_ID) {
        return API_RESPONSES._400(null, "error", "missing product id from the request");
    }
}