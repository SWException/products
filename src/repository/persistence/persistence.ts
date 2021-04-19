import { Product } from "../product";

export interface Persistence {
    
    getIndexPartition(TableName: string,
        index: string, partitionKey: string,
        partitionValue: string, sort: string):
        Promise<any>;

    write (TableName: string, data: any): Promise<boolean>;   
    update (TableName: string, id: string, data: any): Promise<boolean>;
    getScan (TableName: string): Promise<any>;
    delete (TableName: string, id: string): Promise<boolean>;
    changeStock(TableName: string, id: string, quantity: number): Promise<boolean>;
    get(TableName: string, id: string): Promise<any>;
}