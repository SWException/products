import { APIGatewayProxyHandler } from 'aws-lambda';
import { Model } from 'src/core/model';
import API_RESPONSES from "src/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    // filtri o ordinamento o pagina
    const CATEGORY=event.queryStringParameters.category;
    const MINPRICE= event.queryStringParameters.minPrice as unknown as number;
    const MAXPRICE = event.queryStringParameters.maxPrice as unknown as number;
    if (CATEGORY && MINPRICE && MAXPRICE) {
        console.log(CATEGORY, MINPRICE, MAXPRICE);
        const MODEL: Model = Model.createModel();
        return API_RESPONSES._200(await MODEL.getProducts(CATEGORY, MINPRICE, MAXPRICE));
    }
    else 
        return API_RESPONSES._400(null, "error", "missing query parameters")
}
