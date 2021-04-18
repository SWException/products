import { APIGatewayProxyHandler } from 'aws-lambda';
import { Model } from 'src/core/model';
import API_RESPONSES from "src/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const DATA = JSON.parse(event?.body); // filtri o ordinamento o pagina
    const MODEL: Model = Model.createModel();
    return API_RESPONSES._200(await MODEL.getAllProducts(DATA));
}
