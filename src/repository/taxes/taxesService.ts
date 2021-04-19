import fetch from "node-fetch";
import { Taxes } from "./taxes";

export class TaxesService implements Taxes {
    public async getTax (id: string): Promise<any> {
        return await fetch(process.env.SERVICES + `/taxes/${id}`)
            .then(async response => {
                console.log(response.data);
                return response.data ? response.data : null;
            })
    }
}