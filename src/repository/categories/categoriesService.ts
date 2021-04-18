import fetch from "node-fetch";
import { Categories } from "./categories";

export class CategoriesService implements Categories {
    public async getCategoryName(id: string): Promise<string> {
        return await fetch(process.env.SERVICES + `/categories/${id}`)
            .then(async response => {
                const RESPONSE = response.json();
                return RESPONSE["body"]["data"].categoryName ? 
                    RESPONSE["body"]["data"].categoryName : null;
            })
    }
    public async getCategories(): Promise<JSON> {
        return await fetch(process.env.SERVICES + `/categories/`)
            .then(async response => {
                const RESPONSE = response.json();
                return RESPONSE["body"]["data"]? RESPONSE["body"]["data"] : null;
            })
    }

}