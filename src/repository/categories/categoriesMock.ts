import { Categories } from "./categories";

export class CategoriesMock implements Categories {
    
    public async getCategoryName (id: string): Promise<string> {
        return id? "category" : null;
    }
    public async getCategories (): Promise<JSON> {
        const CATEGORIES_ARRAY: JSON= JSON.parse(JSON.stringify(
            [{"id": "1", "name": "category1"},
                {"id": "2", "name": "category2"}]));
        return CATEGORIES_ARRAY;
    }
}