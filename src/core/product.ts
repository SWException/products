export class Product {
    private readonly id: string;
    private readonly name: string;
    private readonly description: string;
    private readonly primaryPhoto: string;
    private readonly secondaryPhoto: Array<string>;
    private readonly category: string;
    private readonly price: number;
    private readonly netPrice: number;
    private readonly tax: string;
    private readonly show: boolean;
    private readonly showHome: boolean;
    private readonly stock: number;


    
    constructor (id: string, name: string, description: string, primaryPhoto: string, secondaryPhoto: 
        Array<string>, category: string,  price: number, netPrice: number, tax: string, 
        show: boolean, showHome: boolean, stock: number){

        this.id = id;
        this.name = name;
        this.description = description;
        this.primaryPhoto = primaryPhoto;
        this.secondaryPhoto = secondaryPhoto;
        this.category = category;
        this.price = price;
        this.netPrice = netPrice;
        this.tax = tax;
        this.show = show;
        this.showHome = showHome;
        this.stock = stock;
    }

    public getID (): string {
        return this.id;
    }

    public getName (): string {
        return this.name;
    }

    public getDescription (): string {
        return this.description;
    }

    public getPrimaryPhoto (): string {
        return this.primaryPhoto;
    }

    public getSecondaryPhoto (): Array<string> {
        return this.secondaryPhoto;
    }

    public getCategory (): string {
        return this.category;
    }

    public getPrice (): number {
        return this.price;
    }

    public getNetPrice (): number {
        return this.netPrice;
    }

    public getTax (): string {
        return this.tax;
    }

    public getShow (): boolean {
        return this.show;
    }
    public getShowHome (): boolean {
        return this.showHome;
    }

    public getStock (): number {
        return this.stock;
    }







}