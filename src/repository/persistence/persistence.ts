import { Product } from "../product";

export interface Persistence {
    
    getCategoryPrice(category: string, sortValueMin: number, sortValueMax: number):
        Promise<any>;

    write (data: any): Promise<boolean>;   
    update (id: string, data: any): Promise<boolean>;
    delete (id: string): Promise<boolean>;
    changeStock(id: string, quantity: number): Promise<boolean>;
    get(id: string): Promise<any>;
}
