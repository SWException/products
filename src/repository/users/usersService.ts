import { Users } from "./users";
import fetch from "node-fetch";

export class UsersService implements Users {
    public async checkVendor (token: string): Promise<boolean> {
        if(typeof token == "undefined"){
            return false;
        }
        return await fetch(process.env.SERVICES + `/users/vendors/check/${token}`)
            .then(responseUser => {
                console.log("If 200 is Vendor: ", responseUser.status);
                return responseUser.status == 200;
            })
            .catch((err) => {
                console.log("checkVendor Error: ", err);
                return false;
            })
    }

    public async checkCustomer (token: string): Promise<boolean> {
        return await fetch(process.env.SERVICES + `/users/customers/check/${token}`)
            .then(responseUser => {
                return responseUser.status == 200;
            })
            .catch(() => {
                return false;
            })
    }   

    public async checkUser (token: string): Promise<boolean> {
        return await fetch(process.env.SERVICES + `/users/check/${token}`)
            .then(responseUser => {
                return responseUser.status == 200;
            })
            .catch(() => {
                return false;
            })
    }   
}