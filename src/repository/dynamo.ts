import { Product } from "src/repository/product";
import { Persistence } from "src/repository/persistence";
import * as AWS from "aws-sdk";

export class Dynamo implements Persistence {

    private static readonly TABLE_PRODUCTS = "products";
    private DOCUMENT_CLIENT = new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });

    public async getAll (): Promise<Array<Product>> {
        const PARAMS = {
            TableName: Dynamo.TABLE_PRODUCTS
        };

        const DATA = await this.DOCUMENT_CLIENT.scan(PARAMS).promise();
        console.log("Data from DB: " + JSON.stringify(DATA));
        const PRODUCTS = new Array<Product>();
        DATA.Items.forEach(element => {
            PRODUCTS.push(new Product(element));
        });

        return PRODUCTS ;
    } 

    public async getItem (id: string): Promise<Product> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: Dynamo.TABLE_PRODUCTS,
            IndexName: "id-index"
        };

        const DATA = await this.DOCUMENT_CLIENT.get(PARAMS).promise();
        return DATA.Item? new Product(DATA.Item) : null;
    }

    public async addItem (item: Product): Promise<boolean> {
        const PARAMS = {
            TableName: Dynamo.TABLE_PRODUCTS,
            Key: {
                id: item.getID()
            },
            Item: item
        };

       const DATA =  this.DOCUMENT_CLIENT.put(PARAMS).promise().catch(
            () => {return false; }
       );

       return (DATA) ? true : false;

    }

    public async editItem (item: Product): Promise<boolean> {
        const VALUES = {};
        let expression = "SET ";
        let first = true;

        Object.keys(item).forEach(function (key) {
            if (key != "id") {
                const VALUE = item[key];
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
            TableName: Dynamo.TABLE_PRODUCTS,
            Key: {
                id: item.getID()
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

    public async deleteItem (id: string): Promise<boolean> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: Dynamo.TABLE_PRODUCTS,
            IndexName: "id-index"
        };

       await this.DOCUMENT_CLIENT.delete(PARAMS).promise().catch(
            (err) => { return err; }
        );
        return true;;      
    }
}
