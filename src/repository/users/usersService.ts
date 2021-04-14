import { Users } from "./Users";
import fetch from "node-fetch";

export class UsersService implements Users {
    public async checkVendor (token: string): Promise<boolean> {
        return await fetch(process.env.SERVICES + `/users/vendors/check/${token}`)
            .then(async responseUser => {
                return responseUser.status == 200;
            })
            .catch(() => {
                return false;
            })
    }

    public async checkCustomer (token: string): Promise<boolean> {
        return await fetch(process.env.SERVICES + `/users/customers/check/${token}`)
            .then(async responseUser => {
                return responseUser.status == 200;
            })
            .catch(() => {
                return false;
            })
    }   
}