import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Persistence } from "./persistence";

export class Dynamo implements Persistence {
    private static readonly DOCUMENT_CLIENT= new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });
    private static readonly TABLE_NAME = "products";

    public async getProductsByName (name: string, onlyShowable = false): Promise<any> {
        console.log("dynamodb getProductsByName");
        const PARAMS: DocumentClient.ScanInput = {
            TableName: Dynamo.TABLE_NAME,
            FilterExpression: "contains(#product_name, :product_name)",
            ExpressionAttributeNames: {
                "#product_name": "name"
            },
            ExpressionAttributeValues: {
                ":product_name": name
            }
        };

        if(onlyShowable){
            PARAMS.FilterExpression += " AND #show = :show";
            PARAMS.ExpressionAttributeNames["#show"] = "show"
            PARAMS.ExpressionAttributeValues[":show"] = true;
        }

        console.log("PARAMS getProductsByName: ", PARAMS);

        const DATA = await Dynamo.DOCUMENT_CLIENT.scan(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA.Items;
    }

    /**
         * delete the item with the given id from the db
         * @param id 
         */

    public async delete (id: string, category?: string): Promise<boolean> {
        console.log("dynamodb delete");
        let cat = null;
        if(category)
            cat = category 
        else
            cat = (await this.get(id))?.category;
        if(!cat){
            throw new Error("product does not exist");
        }
        const PARAMS: DocumentClient.DeleteItemInput = {
            Key: {
                category: cat,
                id: id
            },
            TableName: Dynamo.TABLE_NAME,
            ReturnValues: 'ALL_OLD',
        };

        const DATA = await Dynamo.DOCUMENT_CLIENT.delete(PARAMS).promise();
        console.log("delete DATA: ", DATA);

        if (!DATA.Attributes) {
            throw new Error('Cannot delete item that does not exist')
        }

        return true;  
    }

   
    public async get (id: string, onlyShowable = false): Promise<any> {
        console.log("dynamodb get");
        const PARAMS: DocumentClient.QueryInput = {
            TableName: Dynamo.TABLE_NAME,
            IndexName: "id-index",
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: { 
                ':id': id 
            }
        };

        if(onlyShowable){
            PARAMS.ExpressionAttributeNames = {};
            PARAMS.FilterExpression = "#show = :show";
            PARAMS.ExpressionAttributeNames["#show"] = "show"
            PARAMS.ExpressionAttributeValues[":show"] = true;
        }

        console.log("dynamodb get PARAMS: ", PARAMS);
        
        const DATA = await Dynamo.DOCUMENT_CLIENT.query(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA.Items[0];
    }

    public async getProductsByCategory (category: string, onlyShowable = false, sortValueMin?: number, 
        sortValueMax?: number, sortingAsc?: boolean): Promise<any> {
        console.log("dynamodb getProductsByCategory");

        const PARAMS: DocumentClient.QueryInput = {
            TableName: Dynamo.TABLE_NAME,
            IndexName: "categoryPrice",
            KeyConditionExpression: "category = :partitionValue",
            ExpressionAttributeValues: {
                ":partitionValue": category
            }
        };

        const IS_SET_SORT_VALUE_MAX: boolean = (!isNaN(sortValueMax) || sortValueMax === null);
        const IS_SET_SORT_VALUE_MIN: boolean = (!isNaN(sortValueMin) || sortValueMin === null);

        if ( IS_SET_SORT_VALUE_MAX && IS_SET_SORT_VALUE_MIN) {
            PARAMS.KeyConditionExpression += " AND netPrice BETWEEN :sortValueMin AND :sortValueMax";
            PARAMS.ExpressionAttributeValues[":sortValueMax"] = sortValueMax;
            PARAMS.ExpressionAttributeValues[":sortValueMin"] = sortValueMin;
        }
        else {
            if (IS_SET_SORT_VALUE_MAX) {
                PARAMS.KeyConditionExpression += " AND netPrice < :sortValueMax";
                PARAMS.ExpressionAttributeValues[":sortValueMax"] = sortValueMax;
            }
            else if (IS_SET_SORT_VALUE_MIN) {
                PARAMS.KeyConditionExpression += " AND netPrice > :sortValueMin";
                PARAMS.ExpressionAttributeValues[":sortValueMin"] = sortValueMin;
            }
        }

        if(onlyShowable){
            PARAMS.ExpressionAttributeNames = {}
            PARAMS.FilterExpression = "#show = :show";
            PARAMS.ExpressionAttributeNames["#show"] = "show"
            PARAMS.ExpressionAttributeValues[":show"] = true;
        }

        if(sortingAsc === false || sortingAsc === true ){
            PARAMS["ScanIndexForward"] = sortingAsc;
        }

        console.log("PARAMS getProductsByCategory: ", PARAMS);

        const DATA = await Dynamo.DOCUMENT_CLIENT.query(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA.Items;
    }

    public async getProductsHome (onlyShowable = false): Promise<any> {
        console.log("dynamodb getProductsHome");
        const PARAMS: DocumentClient.ScanInput = {
            TableName: Dynamo.TABLE_NAME,
            FilterExpression: "#showHome = :showHome",
            ExpressionAttributeValues: {
                ":showHome": true
            },
            ExpressionAttributeNames: {
                "#showHome": "showHome",
            }
        };

        if(onlyShowable){
            PARAMS.FilterExpression += " AND #show = :show";
            PARAMS.ExpressionAttributeNames["#show"] = "show"
            PARAMS.ExpressionAttributeValues[":show"] = true;
        }

        const DATA = await Dynamo.DOCUMENT_CLIENT.scan(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA.Items;
    }

    public async write (data: { [key: string]: any }): Promise<boolean> {
        console.log("dynamodb write");
        const PARAMS: DocumentClient.PutItemInput = {
            TableName: Dynamo.TABLE_NAME,
            Item: data
        };
        console.log("write PARAMS: ", PARAMS);
        
        const DATA = await Dynamo.DOCUMENT_CLIENT.put(PARAMS).promise();
        console.log(DATA);
        
        return DATA ? true : false;
    }

    private async updateWithCategoryChanged (productToUpdate: any, partialNewProductWithCategoryChanged: any): 
        Promise<boolean>{
        console.log("dynamodb updateWithCategoryChanged", productToUpdate, partialNewProductWithCategoryChanged);
        
        const OLD_CATEGORY = productToUpdate['category'];

        Object.keys(partialNewProductWithCategoryChanged).forEach(function (key) {
            console.log("forEach key: ", key, productToUpdate[key], partialNewProductWithCategoryChanged[key]);
            
            if (key != "id") {
                if(typeof productToUpdate[key] != "undefined" && productToUpdate[key] !== null){
                    productToUpdate[key] = partialNewProductWithCategoryChanged[key];
                }
            }
        });
        console.log("Updated product: ", productToUpdate);
        
        const WRITE = await this.write(productToUpdate);
        if(!WRITE){
            throw Error("Error updating product");
        }

        const DELETE = await this.delete(productToUpdate["id"], OLD_CATEGORY);
        if(!DELETE){
            throw Error("Ops, I insert a new updated product with the same ID insted of updating the requested one. \
            Now there are at least 2 products with the same ID. Sorry, this is really bad and can cause some problems. \
            Try to delete one of them but I'm not sure I delete the one you will select. Bro, understand me! \
            Them have the same ID so I can't known which one you will choose and maybe I'm going to delete both. \
            Sorry, next time this will not happen");
        }

        return true;
    }

    public async update (id: string, data: any): Promise<boolean>{
        console.log("dynamodb update");
        
        const PRODUCT = await this.get(id);

        if(data && data["category"] && data["category"] != PRODUCT["category"]){
            // È cambiata la categoria: devo eliminare il prodotto e reinserirlo nel db 
            // perché category fa parte della chiave
            return await this.updateWithCategoryChanged(PRODUCT, data);
        }

        const PARAMS: DocumentClient.UpdateItemInput = {
            TableName: Dynamo.TABLE_NAME,
            Key: {
                category: PRODUCT["category"],
                id: id
            }
        }

        let first = true;

        Object.keys(data).forEach(function (key) {
            if (key != "id" && key != "category") {
                const VALUE = data[key];
                if (!first) {
                    PARAMS.UpdateExpression += ", "
                } 
                else {
                    first = false;
                    PARAMS.UpdateExpression = "SET ";
                    PARAMS.ExpressionAttributeNames = {};
                    PARAMS.ExpressionAttributeValues = {}
                }
                PARAMS.UpdateExpression += "#"+ key + " = :" + key;
                PARAMS.ExpressionAttributeValues[":" + key] = VALUE;
                PARAMS.ExpressionAttributeNames["#" + key] = key;
            }
        });

        console.log(PARAMS);

        const DATA = await Dynamo.DOCUMENT_CLIENT.update(PARAMS).promise();
        return DATA ? true : false;
    }
}
