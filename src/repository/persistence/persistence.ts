import { Product } from "../product";

export interface Persistence {
    
    getIndexPartition(TableName: string,
        index: string, partitionKey: string,
        partitionValue: string, sort: string):
        Promise<Array<Product>>;

    write (TableName: string, data: JSON): Promise<boolean>;   
    update (TableName: string, id: string, data: JSON): Promise<boolean>;
    getScan (TableName: string): Promise<Array<Product>>;
    delete (TableName: string, id: string): Promise<boolean>;
    changeStock(TableName: string, id: string, quantity: number): Promise<boolean>;
    get(TableName: string, id: string): Promise<Product>;
}