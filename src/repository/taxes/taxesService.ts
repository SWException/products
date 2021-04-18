import fetch from "node-fetch";
import { Taxes } from "./taxes";

export class TaxesService implements Taxes {
    public async getAllTaxes (): Promise<any> {
        return await fetch(process.env.SERVICES + `/taxes/`)
            .then(async response => {
                const RESPONSE = response.json();
                return RESPONSE["data"]? RESPONSE["data"] : null;
            })
    }
}