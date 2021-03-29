import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';
import Product from 'src/types/Product';
import API_RESPONSES from "src/utils/apiResponses";
import { S3 as s3 } from "src/utils/s3"

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


    // handle product image (only if there is an image)
    if (DATA.image) {
        try {
            const BUCKETNAME = process.env.PRODUCT_IMG_BUCKET;
            //DATA.image become an URL
            DATA.image = s3.uploadImage(DATA.image.imageCode, BUCKETNAME);
        }
        catch (err) {
            return API_RESPONSES._400(null, "error", '' + err.name + '' + err.message + '');
        }
    }
    const RES: boolean = await Product.createNewProduct(DATA);

    console.log(JSON.stringify(RES));

    if (RES)
        return API_RESPONSES._200(null);
    else
        return API_RESPONSES._400(null, null, "error in the creation of the product");
}