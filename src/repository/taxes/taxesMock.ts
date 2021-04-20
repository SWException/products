import { Taxes } from "./taxes";

export class TaxesMock implements Taxes {
    public async getTax (id: string): Promise<any>{
        return id? {
            id: "1",
            value: 22,
            description:"iva"
        } : null;
    }
}