import { Persistence } from "./persistence";
import { Product } from "../product";

export class DbMock implements Persistence {
    public async getIndexPartition (TableName: string,
        index: string, partitionKey: string,
        partitionValue: string, sort: string):
        Promise<Array<Product>>{
        
        return null;
    }
    
    public async write (TableName: string, data: JSON): Promise<boolean>{
        return true;
    }
    
    public async update (TableName: string, id: string, data: JSON): Promise<boolean>{
        return true;
    }

    public async getScan (TableName: string): Promise<Array<Product>>{
        return null;
    }

    public async delete (TableName: string, id: string): Promise<boolean>{
        return true;
    }

    public async changeStock (TableName: string, id: string, quantity: number): Promise<boolean>{
        return true;
    }

    public async get (TableName: string, id: string): Promise<Product>{
        return new Product({
            "id": id,
            "name": "mock product",
            "description": "this is a mock",
            "category": "mock",
            "netPrice": 2.5,
            "tax": 22
        });
    }
}