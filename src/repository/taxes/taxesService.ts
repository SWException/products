import fetch from "node-fetch";
import { Taxes } from "./taxes";

export class TaxesService implements Taxes {
    public async getTax (id: string): Promise<any> {
        return await fetch(process.env.SERVICES + `/taxes/${id}`)
            .then(async response => {
                const RESPONSE = response.json();
                return RESPONSE["data"] ? RESPONSE["data"] : null;
            })
    }
}