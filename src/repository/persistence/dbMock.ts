import { Persistence } from "./persistence";

export class DbMock implements Persistence {

    private readonly PRODUCT_1= {
        "id": "-1",
        "name": "mock product 1",
        "description": "this is a mock",
        "category": "-1",
        "netPrice": 2.5,
        "tax": "-1"
    };
    private readonly PRODUCT_2= {
        "id": "-2",
        "name": "mock product 2",
        "description": "this is a mock",
        "category": "-2",
        "netPrice": 2.5,
        "tax": "-2"
    };
    
    public async getProductsByName(name: string): Promise<any> {
        if (name) {
            return [this.PRODUCT_1, this.PRODUCT_2];
        }

        return [];
    }

    public async getProductsByCategory (category: string, _sortValueMin?: number, _sortValueMax?: number, _sortingAsc?: boolean):
    Promise<any>{
        return category? [this.PRODUCT_1, this.PRODUCT_2] : false;
    }

    public async getProductsHome (): Promise<any> {
        return [this.PRODUCT_1, this.PRODUCT_2];
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
        return (id)?{
            "id": id,
            "name": "mock product",
            "description": "this is a mock",
            "category": "-1",
            "netPrice": 2.5,
            "tax": "-1"
        }:null;
    }
}