
export interface Persistence {
    getProductsByName (name: string): Promise<any>
    getProductsHome(): Promise<any>;
    getProductsByCategory(category: string, sortValueMin?: number, sortValueMax?: number, sortingAsc?: boolean):
        Promise<any>;
    write (data: any): Promise<boolean>;   
    update (id: string, data: any): Promise<boolean>;
    delete (id: string): Promise<boolean>;
    get(id: string): Promise<any>;
    
}
