import { Users } from "./users";

export class UsersMock implements Users {
    public async checkVendor (token: string): Promise<boolean> {
        return token? true : false;
    }
    public async checkCustomer (token: string): Promise<boolean> {
        return token? true : false;
    }
    public async  checkUser(token: string): Promise<boolean> {
        return token? true : false;
    }
}