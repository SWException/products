import { APIGatewayProxyHandler } from 'aws-lambda';
import Product from 'src/types/Product';
import API_RESPONSES from "src/utils/apiResponses";
import { getTokenFromEvent, getBodyDataFromEvent } from "src/utils/checkJWT";
import {S3 as s3} from "src/utils/s3"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    //console.log("event", event);

    const TOKEN = getTokenFromEvent(event);
    if (TOKEN == null) {
        return API_RESPONSES._400(null, "error", "manca TOKEN");
    }
    else {
        const USER: User = await User.createUser(TOKEN);
        if (!(USER && USER.isAuthenticate() && USER.isAdmin())) {
            return API_RESPONSES._400(null,
                "error", "TOKEN non valido o scaduto");
        }
    }

    const DATA = JSON.parse(event.body);
    // handle product image (only if there is an image)
    if (DATA.image) {
        
        try {
            const BUCKETNAME= process.env.PRODUCT_IMG_BUCKET;
            //DATA.image become an URL
            DATA.image = await s3.uploadImage(DATA.image.imageCode,  BUCKETNAME); 
        } 
        catch (err) {
            return API_RESPONSES._400(null, "error", '' + err.name + ''  +  err.message+'');
        }
    }
    const RES: boolean = await Product.createNewProduct(DATA);

    console.log(JSON.stringify(RES));

    if (RES)
        return API_RESPONSES._200(null);
    else
        return API_RESPONSES._400(null);
}
