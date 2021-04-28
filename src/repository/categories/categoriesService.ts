import fetch from "node-fetch";
import { Categories } from "./categories";

export class CategoriesService implements Categories {
    public async getCategoryName (id: string): Promise<string> {
        const RESPONSE = await fetch(process.env.SERVICES + `/categories/${id}`)
        const BODY = await RESPONSE.json();
        console.log(BODY);
        return BODY.data?.name? BODY.data.name : null;
    }
    public async getCategories (): Promise<any> {
        return await fetch(process.env.SERVICES + `/categories/`)
            .then(res => res.json())
            .then((RESPONSE) => {
                return RESPONSE?.data? RESPONSE.data : [];
            })
    }

}