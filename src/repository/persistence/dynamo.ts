import * as AWS from "aws-sdk";
import { Persistence } from "./persistence";
import { Product } from "../product";

export class Dynamo implements Persistence {
    private readonly DOCUMENT_CLIENT;

    constructor () {
        this.DOCUMENT_CLIENT = new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });
    }

    /**
     * 
     * @param TableName 
     * @param id id of the product
     * @param quantity the amount to add or remove from stock (can be negative)
     */
    changeStock (TableName: string, id: string, quantity: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    /**
         * delete the item with the given id from the db
         * @param TableName 
         * @param id 
         */

    public async delete (TableName: string, id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
        //TODO
    }

    public async getScan (TableName: string):
            Promise<any> {
        const PARAMS = {
            TableName: TableName
        };

        const DATA = await this.DOCUMENT_CLIENT.scan(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        if (DATA.Items == null)
            return null;
        return DATA.Items;
    }

    public async get (TableName: string, id: string):
            Promise<any> {
        const PARAMS = {
            TableName: TableName,
            IndexName: "id-index",
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: { 
                ':id': id 
            } 
        };

        const DATA = await this.DOCUMENT_CLIENT.query(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        return new Product(DATA[0])
    }

    public async getIndexPartition (TableName: string, 
        index: string, partitionKey: string,
        partitionValue: string, sort: string):
        Promise<any> {
            
        let IndexForward = true;
        if(sort== "DESC") {IndexForward = false;}

        const PARAMS = {
            TableName: TableName,
            IndexName: index,
            KeyConditionExpression: 
                    "#partitionKey= :partitionValue",
            ExpressionAttributeNames:{
                "#partitionKey": partitionKey
            },
            ExpressionAttributeValues:{
                ":partitionValue": partitionValue
            },
            ScanIndexForward: IndexForward
        };

        const DATA = await this.DOCUMENT_CLIENT.query(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA.Items;
    }

    async getIndexSort (TableName: string, index: string, partitionKey: string,
        partitionValue: string, sortKey: string,
        sortValueMin: string, sortValueMax: string):
        Promise<AWS.DynamoDB.DocumentClient.AttributeMap> {
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
            TableName: TableName,
            IndexName: index,
            KeyConditionExpression: ConditionExpression,
            ExpressionAttributeName:{
                "#partitionKey": partitionKey,
                "#sortKey": sortKey,
            
            },
            ExpressionAttributeValues:{
                ":partitionValue": partitionValue,
                ":sortValue": sortValueMin,
                ":sortValueMin": sortValueMin,
                ":sortValueMax": sortValueMax,
                
            }
        };

        const DATA = await this.DOCUMENT_CLIENT.query(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA.Items;
        /*
            * Il valore ritornato potrebbe essere null.
            * Ad esempio se non esiste un carrello per quell'utente
            */
    }


    public async append (TableName: string, field: string, id: string,
        data: { [key: string]: any }): Promise<boolean> {

        const PARAMS = {
            TableName: TableName,
            Key: {
                id: id
            },
            UpdateExpression: "SET #c = list_append(#c, :vals)",
            ExpressionAttributeNames: {
                "#c": field
            },
            ExpressionAttributeValues: {
                ":vals": data
            }
        }
        const DATA = await this.DOCUMENT_CLIENT.update(PARAMS).promise().catch(
            () => { return false; }
        );
        return (DATA) ? true : false;
    }

    public async write (TableName: string, 
        data: { [key: string]: any }): Promise<boolean> {

        const PARAMS = {
            TableName: TableName,
            Key: {
                id: data.id
            },
            Item: data
        };
        const DATA = await this.DOCUMENT_CLIENT.put(PARAMS).promise().catch(
            () => { return false; }
        );
        return DATA ? true : false;
    }

    public async update (TableName: string, id: string, data: JSON): Promise<boolean>{
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
            TableName: TableName,
            Key: {
                id: id
            },
            UpdateExpression: expression,
            ExpressionAttributeValues: VALUES
        }
        console.log(PARAMS);

        const DATA = await this.DOCUMENT_CLIENT.update(PARAMS).promise().catch(
            (err) => { return err; }
        );
        return DATA;
    }
}
