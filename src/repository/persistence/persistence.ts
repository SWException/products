export interface Persistence {
    getProductsByName (name: string, onlyShowable?: boolean): Promise<any>;
    getProductsHome (onlyShowable?: boolean): Promise<any>;
    getProductsByCategory (category: string, onlyShowable?: boolean, sortValueMin?: number, 
        sortValueMax?: number, sortingAsc?: boolean): Promise<any>;
    write (data: any): Promise<boolean>;   
    update (id: string, data: any): Promise<boolean>;
    delete (id: string): Promise<boolean>;
    get (id: string, onlyShowable?: boolean): Promise<any>;
}
