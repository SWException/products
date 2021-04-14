export interface Users {
    checkVendor(token: string): Promise<boolean>;
    checkCustomer(token: string): Promise<boolean>;
}