import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';
import API_RESPONSES from "src/utils/apiResponses"
import { S3 as s3 } from "src/utils/s3"
import Product from './types/Product';

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    // checking for the permissions
    const TOKEN = event.headers?.Authorization;;
    if (TOKEN == null) {
        return API_RESPONSES._400(null, "error", "missing authentication token");
    }
    const DATA = async () => {
        await fetch(`https://95kq9eggu9.execute-api.eu-central-1.amazonaws.com/dev/users/check/${TOKEN}`)
            .then(response => response.json())
            .then(data => {
                if (data.status != "success")
                    throw new Error(data.message);
                if (data.username != "vendor")
                    throw new Error("Only a vendor can remove a category");
                return JSON.parse(event?.body);
            })
            .catch((err) => {
                console.log(err)
                return null
            })
    }
    if (!DATA) {
        return API_RESPONSES._400(null, null, "error during the permissions check")
    }
    //check for the id of the product 
    const PRODUCT_ID: string = event.pathParameters?.id;
    if (!PRODUCT_ID) {
        return API_RESPONSES._400(null, null, "id prodotto non presente");
    }
    //image replacing, if needed
    if (DATA['image']) {
        const BUCKETNAME= process.env.PRODUCT_IMG_BUCKET;
        s3.deleteFile(BUCKETNAME, DATA['image'].key)
        DATA['image']= await s3.uploadImage(DATA['image'].imageCode,  BUCKETNAME);
    }

    const RES = await Product.updateProduct(DATA['id'], DATA);

    console.log(JSON.stringify(RES));

    return API_RESPONSES._200(JSON.parse(JSON.stringify(RES)));
}