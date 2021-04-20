import { Product } from "../product";

export interface Persistence {
    
    getIndexPartition(index: string, partitionKey: string, partitionValue: string, sort: string):
        Promise<any>;

    write (data: any): Promise<boolean>;   
    update (id: string, data: any): Promise<boolean>;
    getScan (): Promise<any>;
    delete (id: string): Promise<boolean>;
    changeStock(id: string, quantity: number): Promise<boolean>;
    get(id: string): Promise<any>;
}