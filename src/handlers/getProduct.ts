import { APIGatewayProxyHandler } from 'aws-lambda';
import { Model } from 'src/core/model';
import { Product } from 'src/repository/product';
import API_RESPONSES from "src/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const PRODUCT_ID = event.pathParameters?.id;

    const TOKEN: string = event.headers?.Authorization;
    console.log("TOKEN: ", TOKEN);
    

    const MODEL: Model = Model.createModel();
    try {
        const PRODUCT: Product = await MODEL.getProduct(PRODUCT_ID, TOKEN);
        console.log(JSON.stringify(PRODUCT));
        if (PRODUCT) {
            return API_RESPONSES._200(PRODUCT);
        }
    }
    catch (err){
        console.log(err.message);
        return API_RESPONSES._400(null, "error", err.message);   
    }
}
