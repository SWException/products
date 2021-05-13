import { APIGatewayProxyHandler } from 'aws-lambda';
import { Model } from 'src/core/model';
import API_RESPONSES from "src/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    // filtri o ordinamento o pagina
    const CATEGORY = event?.queryStringParameters?.category;
    const MINPRICE: number = +event?.queryStringParameters?.minPrice;
    const MAXPRICE: number = +event?.queryStringParameters?.maxPrice;
    const SORTING: string = event?.queryStringParameters?.sorting;
    const SEARCH: string = event?.queryStringParameters?.search;

    const TOKEN: string = event.headers?.Authorization;

    const MODEL: Model = Model.createModel();
    if (CATEGORY) {
        console.log(CATEGORY, MINPRICE, MAXPRICE);
        return await MODEL.getProducts(CATEGORY, MINPRICE, MAXPRICE, SORTING, TOKEN)
            .then((PRODUCTS) => {
                return API_RESPONSES._200(PRODUCTS);
            })
            .catch((err) => {
                console.log(err.message);
                return API_RESPONSES._400(null, "error", "getProducts - " + err.message);
            });
    }
    else if (SEARCH) {
        return await MODEL.getProductsByName(SEARCH, TOKEN)
            .then((PRODUCTS) => {
                return API_RESPONSES._200(PRODUCTS);
            })
            .catch((err) => {
                console.log(err.message);
                return API_RESPONSES._400(null, "error", "getProductsByName - " + err.message);
            });
    }
    else{
        return await MODEL.getHomeProducts(TOKEN)
            .then((PRODUCTS) => {
                return API_RESPONSES._200(PRODUCTS);
            })
            .catch((err) => {
                console.log(err.message);
                return API_RESPONSES._400(null, "error", "getHomeProducts - " + err.message);
            });

    }
}
