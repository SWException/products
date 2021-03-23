import { APIGatewayProxyHandler } from 'aws-lambda';
import Product from 'src/Product';
import API_RESPONSES from "src/utils/apiResponses"
import { getQueryDataFromEvent } from 'src/utils/checkJWT';

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const DATA = getQueryDataFromEvent(event); // filtri o ordinamento o pagina
    
    return API_RESPONSES._200(await Product.buildAllProduct(DATA));
}
