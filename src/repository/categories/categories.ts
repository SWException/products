export interface Categories {
    getCategoryName(id:string) : Promise<string>;
    getCategories():Promise<JSON>;
}