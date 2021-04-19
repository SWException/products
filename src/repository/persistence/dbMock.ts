import { Persistence } from "./persistence";
import { Product } from "../product";

export class DbMock implements Persistence {
    public async getIndexPartition (TableName: string,
        index: string, partitionKey: string,
        partitionValue: string, sort: string):
        Promise<any>{
        
        return null;
    }
    
    public async write (TableName: string, data: any): Promise<boolean>{
        return true;
    }
    
    public async update (TableName: string, id: string, data: any): Promise<boolean>{
        return true;
    }

    public async getScan (TableName: string): Promise<JSON>{
        return null;
    }

    public async delete (TableName: string, id: string): Promise<boolean>{
        return true;
    }

    public async changeStock (TableName: string, id: string, quantity: number): Promise<boolean>{
        return true;
    }

    public async get (TableName: string, id: string): Promise<any>{
        return {
            "id": id,
            "name": "mock product",
            "description": "this is a mock",
            "category": "mock",
            "netPrice": 2.5,
            "tax": 22
        };
    }
}