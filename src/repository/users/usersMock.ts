import { Users } from "./Users";

export class UsersMock implements Users {
    public async checkVendor (token: string): Promise<boolean> {
        return true;
    }
    public async checkCustomer (token: string): Promise<boolean> {
        return true;
    }
}