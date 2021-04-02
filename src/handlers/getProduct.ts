import { APIGatewayProxyHandler } from 'aws-lambda';
import Product from 'src/types/Product';
import API_RESPONSES from "src/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const PRODUCT_ID = event.pathParameters?.id;

    const PRODUCT: Product = await Product.buildProduct(PRODUCT_ID);

    console.log(JSON.stringify(PRODUCT));

    if (PRODUCT) {
        return API_RESPONSES._200(PRODUCT);
    }
    else {
        return API_RESPONSES._400(null, "error", "prodotto non presente");
    }
}
