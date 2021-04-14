import { Taxes } from "./taxes";

export class TaxesService implements Taxes {
    public async getAllTaxes(): Promise<any> {
        throw new Error("not implemented");
    }
}