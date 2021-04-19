import fetch from "node-fetch";
import { Categories } from "./categories";

export class CategoriesService implements Categories {
    public async getCategoryName (id: string): Promise<string> {
        const RESPONSE= await fetch(process.env.SERVICES + `/categories/${id}`)
        const BODY= await RESPONSE.json();
        console.log(BODY);
        return BODY.data.categoryName? BODY.data.categoryName : null;
    }
    public async getCategories (): Promise<JSON> {
        return await fetch(process.env.SERVICES + `/categories/`)
            .then(async response => {
                const RESPONSE = response.json();
                return RESPONSE["data"]? RESPONSE["data"] : null;
            })
    }

}