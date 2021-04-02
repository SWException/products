import { APIGatewayProxyHandler } from 'aws-lambda';
import { Model } from 'src/core/model';
import Product from 'src/core/Product';
import API_RESPONSES from "src/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const PRODUCT_ID = event.pathParameters?.id;

    const MODEL: Model = Model.createModel();
    const PRODUCT: Product = await MODEL.buildProduct(PRODUCT_ID);

    console.log(JSON.stringify(PRODUCT));

    if (PRODUCT) {
        return API_RESPONSES._200(PRODUCT);
    }
    else {
        return API_RESPONSES._400(null, "error", "prodotto non presente");
    }
}
