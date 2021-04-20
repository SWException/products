import { Persistence } from "./persistence";

export class DbMock implements Persistence {
    private readonly PRODUCT_1= {
        "id": "1",
        "productName": "mock product 1",
        "description": "this is a mock",
        "category": "1",
        "netPrice": 2.5,
        "tax": "1"
    };
    private readonly PRODUCT_2= {
        "id": "2",
        "productName": "mock product 2",
        "description": "this is a mock",
        "category": "2",
        "netPrice": 2.5,
        "tax": "2"
    };

    public async getCategoryPrice (category: string, sortValueMin: number, sortValueMax: number):
    Promise<any>{
        return category && sortValueMin && sortValueMax? [this.PRODUCT_1, this.PRODUCT_2] : false;
    }
    
    public async write (data: any): Promise<boolean>{
        return data? true : false;
    }
    
    public async update (id: string, data: any): Promise<boolean>{
        return id && data? true : false;
    }


    public async delete (id: string): Promise<boolean>{
        return id? true : false;
    }

    public async get (id: string): Promise<any>{
        return {
            "id": id,
            "productName": "mock product",
            "description": "this is a mock",
            "category": "1",
            "netPrice": 2.5,
            "tax": "1"
        };
    }
}