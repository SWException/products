export class Product {
    // CAMPI DATI
    private readonly id: string;
    private readonly name: string;
    private readonly description: string;
    private readonly category: string;
    private readonly categoryId: string;
    private readonly price: number;
    private readonly netPrice: number;
    private readonly tax: number;
    private readonly taxId: string;
    private readonly primaryPhoto: string;
    private readonly secondaryPhotos: Array<string>;
    private readonly stock: number;
    private readonly show: boolean;
    private readonly showHome: boolean;

    constructor (product: { [key: string]: any }) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.categoryId = product?.categoryId;
        this.category = product.category;
        this.netPrice = product.netPrice;
        this.taxId = product?.taxId;
        this.tax = product.tax;
        this.price = this.calculatePrice().toFixed(2);
        this.stock = product.stock;
        this.show = (typeof product.show === "boolean") ? product.show : true;
        this.showHome = (typeof product.showHome === "boolean") ? product.showHome : false;
        if (product.primaryPhoto) {
            this.primaryPhoto = product.primaryPhoto;
            if (product.secondaryPhotos) {
                this.secondaryPhotos = new Array<string>();
                for (let i = 0; i < product.secondaryPhotos.length; i++) {
                    this.secondaryPhotos[i] = product.secondaryPhotos[i];
                }
            }
        }    
        console.log(this.id, this.name, this.description, 
            this.category, this.categoryId, this.taxId, this.price,
            this.secondaryPhotos, this.primaryPhoto, 
            this.stock, this.show, this.showHome);
    }

    // METODI PRIVATI
    private calculatePrice () {
        const PRICE = this.netPrice * (this.tax / 100 + 1); //calculate
        return Math.round(PRICE*100)/100; //round
    }
}
