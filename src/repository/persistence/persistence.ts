import { Product } from "../product";

export interface Persistence {
    
    getCategoryPrice(category: string, price: number, sortValueMin: string, sortValueMax: string):
        Promise<any>;

    write (data: any): Promise<boolean>;   
    update (id: string, data: any): Promise<boolean>;
    delete (id: string): Promise<boolean>;
    get(id: string): Promise<any>;
}
