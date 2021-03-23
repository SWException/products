import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';
import Product from 'src/Product';
import API_RESPONSES from "src/utils/apiResponses"
import { getTokenFromEvent, getBodyDataFromEvent } from "src/utils/checkJWT";
import { S3 as s3 } from "src/utils/s3"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    //console.log("event", event);

    const TOKEN = getTokenFromEvent(event);
    if (TOKEN == null) {
        return API_RESPONSES._400(null, "error", "manca TOKEN");
    }

    // chiamata a microservizio users
    let ciao;
    await fetch('https://95kq9eggu9.execute-api.eu-central-1.amazonaws.com/dev/jwt/' + TOKEN).then(async data => { ciao = await data.json(); });
    console.log(ciao);
    return API_RESPONSES._200(ciao);

}
    /*else {
    const USER: User = await User.createUser(TOKEN);
    if (!(USER && USER.isAuthenticate() && USER.isAdmin())) {
        return API_RESPONSES._400(null,
            "error", "TOKEN non valido o scaduto");
    }
}*/

/*
let PRODUCT_ID: number = +event.pathParameters?.id;
if(!PRODUCT_ID){
    return API_RESPONSES._400(null, "error", "id prodotto non presente");
}
*/
/*
    const DATA = getBodyDataFromEvent(event);
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

*/
