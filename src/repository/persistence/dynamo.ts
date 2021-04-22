import * as AWS from "aws-sdk";
import { Persistence } from "./persistence";

export class Dynamo implements Persistence {
    private static readonly DOCUMENT_CLIENT= new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });
    private static readonly TABLE_NAME = "products"

    /**
         * delete the item with the given id from the db
         * @param id 
         */

    public async delete (id: string): Promise<boolean> {
        const PRODUCT = await this.get(id);
        const PARAMS = {
            Key: {
                category: PRODUCT.category,
                id: id
            },
            TableName: Dynamo.TABLE_NAME,
            IndexName: "id-index"
        };

        await Dynamo.DOCUMENT_CLIENT.delete(PARAMS).promise().catch(
            (err) => { return err; }
        );
        return true;  
    }

   
    public async get (id: string): Promise<any> {
        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            IndexName: "id-index",
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: { 
                ':id': id 
            } 
        };

        const DATA = await Dynamo.DOCUMENT_CLIENT.query(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA.Items[0];
    }

    public async getProductsByCategory (category: string, sortValueMin: number, sortValueMax: number):
        Promise<any> {
        let ConditionExpression: string = "category = :partitionValue";
        let AttributeValues = {
            ":partitionValue": category
        };

        if (!isNaN(sortValueMax) && !isNaN(sortValueMin)) {
            ConditionExpression += " AND netPrice BETWEEN :sortValueMin AND :sortValueMax";
            AttributeValues[":sortValueMax"] = sortValueMax;
            AttributeValues[":sortValueMin"] = sortValueMin;
        }
        else {
            if (!isNaN(sortValueMax)) {
                ConditionExpression += " AND netPrice < :sortValueMax";
                AttributeValues[":sortValueMax"] = sortValueMax;
            }
            else if (!isNaN(sortValueMin)) {
                ConditionExpression += " AND netPrice > :sortValueMin";
                AttributeValues[":sortValueMin"] = sortValueMin;
            }
        }

        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            IndexName: "categoryPrice",
            KeyConditionExpression: ConditionExpression,
            ExpressionAttributeValues: AttributeValues
        };
        console.log("PARAMS getProductsByCategory: ", PARAMS);

        const DATA = await Dynamo.DOCUMENT_CLIENT.query(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA.Items;
    }

    public async getProductsHome (): Promise<any> {
        //TODO: Da fare che ritorna solo quelli indicati come da visualizzare in home. Per ora li torna tutti
        const PARAMS = {
            TableName: Dynamo.TABLE_NAME
        };

        const DATA = await Dynamo.DOCUMENT_CLIENT.scan(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA.Items;
    }

    public async write (data: { [key: string]: any }): Promise<boolean> {
        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            Key: {
                category: data.category,
                id: data.id
                
            },
            Item: data
        };
        const DATA = await Dynamo.DOCUMENT_CLIENT.put(PARAMS).promise().catch(
            () => { return false; }
        );
        return DATA ? true : false;
    }

    public async update (id: string, data: any): Promise<boolean>{
        const VALUES = {};
        let expression = "SET ";
        let first = true;

        Object.keys(data).forEach(function (key) {
            if (key != "id") {
                const VALUE = data[key];
                if (!first) {
                    expression += ", "
                } 
                else {
                    first = false;
                }
                expression += key + " = :" + key;
                VALUES[":" + key] = VALUE;
            }
        });

        let product = await this.get(id);

        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            Key: {
                category: product["category"],
                id: id
            },
            UpdateExpression: expression,
            ExpressionAttributeValues: VALUES
        }
        console.log(PARAMS);

        const DATA = await Dynamo.DOCUMENT_CLIENT.update(PARAMS).promise().catch(
            (err) => { console.log(err); return false;}
        );
        return DATA ? true : false;
    }
}
