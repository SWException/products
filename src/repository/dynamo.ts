import * as AWS from "aws-sdk";
import { Persistence } from "./persistence";


export class Dynamo implements Persistence {

    /**
     * 
     * @param TableName 
     * @param id id of the product
     * @param quantity the amount to add or remove from stock (can be negative)
     */
    changeStock(TableName: string, id: string, quantity: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

DOCUMENT_CLIENT = new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });

/**
     * delete the item with the given id from the db
     * @param TableName 
     * @param id 
     */

async delete(TableName: string, id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
    //TODO
}



async getScan (TableName: string):
        Promise<AWS.DynamoDB.DocumentClient.AttributeMap> {
    const PARAMS = {
        TableName: TableName
    };

    const DATA = await this.DOCUMENT_CLIENT.scan(PARAMS).promise();
    console.log("Data from DB: " + JSON.stringify(DATA));
    return DATA.Items;
    /*
         * Il valore ritornato potrebbe essere null.
         * Ad esempio se non esiste un carrello per quell'utente
         */
}

async get (TableName: string, id: string):
        Promise<AWS.DynamoDB.DocumentClient.AttributeMap> {
    const PARAMS = {
        Key: {
            id: id
        },
        TableName: TableName,
        IndexName: "id-index"
    };

    const DATA = await this.DOCUMENT_CLIENT.get(PARAMS).promise();
    console.log("Data from DB: " + JSON.stringify(DATA));
    return DATA.Item;
    /*
         * Il valore ritornato potrebbe essere null.
         * Ad esempio se non esiste un carrello per quell'utente
         */
}

async getIndexPartition (TableName: string, 
    index: string, partitionKey: string,
    partitionValue: string, sort: string):
    Promise<AWS.DynamoDB.DocumentClient.AttributeMap> {
        
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
    /*
        * Il valore ritornato potrebbe essere null.
        * Ad esempio se non esiste un carrello per quell'utente
        */
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


async append (TableName: string, field: string, id: string,
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

async write (TableName: string, 
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
    return (DATA) ? true : false;
}

async update (TableName: string, id: string, data: JSON): Promise<boolean>{
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