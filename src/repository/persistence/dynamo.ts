import * as AWS from "aws-sdk";
import { Persistence } from "./persistence";

export class Dynamo implements Persistence {
    private static readonly DOCUMENT_CLIENT= new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });
    private static readonly TABLE_NAME = "products"

    /**
     * 
     * @param id id of the product
     * @param quantity the amount to add or remove from stock (can be negative)
     */
    changeStock (id: string, quantity: number): Promise<boolean> {
        console.log(id, quantity);
        throw new Error("Method not implemented.");
    }

    /**
         * delete the item with the given id from the db
         * @param id 
         */

     public async delete (id: string): Promise<boolean> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: Dynamo.TABLE_NAME,
            IndexName: "id-index"
        };

       await Dynamo.DOCUMENT_CLIENT.delete(PARAMS).promise().catch(
            (err) => { return err; }
        );
        return true;;      
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

    async getCategoryPrice (category: string, price: number,
        sortValueMin: string, sortValueMax: string):
        Promise<any> {
        let ConditionExpression: string;
        if (sortValueMin && sortValueMax) {
            ConditionExpression = 
                "#partitionKey= :partitionValue AND "+
                "#sortKey BETWEEN :sortValueMin AND :sortValueMax";
        }
        else if(sortValueMax) {
            ConditionExpression =
                "#partitionKey= :partitionValue AND #sortKey < :sortValueMax";
        }
        else if(sortValueMin) {
            ConditionExpression =
                "#partitionKey= :partitionValue AND #sortKey > :sortValueMin";
        }
            
        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            IndexName: "categoryPrice",
            KeyConditionExpression: ConditionExpression,
            ExpressionAttributeName:{
                "#partitionKey": "category",
                "#sortKey": "price",
            
            },
            ExpressionAttributeValues:{
                ":partitionValue": category,
                ":sortValue": price,
                ":sortValueMin": sortValueMin,
                ":sortValueMax": sortValueMax,
                
            }
        };

        const DATA = await Dynamo.DOCUMENT_CLIENT.query(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA.Items;
    }

    public async write (data: { [key: string]: any }): Promise<boolean> {

        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            Key: {
                id: data.id
            },
            Item: data
        };
        const DATA = await Dynamo.DOCUMENT_CLIENT.put(PARAMS).promise().catch(
            () => { return false; }
        );
        return DATA ? true : false;
    }

    public async update (id: string, data: JSON): Promise<boolean>{
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

        const PARAMS = {
            TableName: Dynamo.TABLE_NAME,
            Key: {
                id: id
            },
            UpdateExpression: expression,
            ExpressionAttributeValues: VALUES
        }
        console.log(PARAMS);

        const DATA = await Dynamo.DOCUMENT_CLIENT.update(PARAMS).promise().catch(
            (err) => { return err; }
        );
        return DATA;
    }
}
