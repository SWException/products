import { Taxes } from "./taxes";

export class TaxesMock implements Taxes {
    public async getAllTaxes (): Promise<any>{
        return {
            taxes: [
                {
                    id: "1",
                    value: 22
                },
                {
                    id: "2",
                    value: 10
                }
            ]
        };
    }
}