import { APIGatewayProxyHandler } from 'aws-lambda';
import Product from 'src/core/Product';
import API_RESPONSES from "src/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const DATA = JSON.parse(event?.body); // filtri o ordinamento o pagina
    const MODEL: Model = Model.createModel();
    return API_RESPONSES._200(await MODEL.buildAllProduct(DATA));
}
