import fetch from "node-fetch";
import { Taxes } from "./taxes";

export class TaxesService implements Taxes {
    public async getTax (id: string): Promise<any> {
        const RESPONSE = await fetch(process.env.SERVICES + `/taxes/${id}`);
        const BODY= await RESPONSE.json();
        console.log(BODY);
        return BODY.data? BODY.data : null;
    }
}