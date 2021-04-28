export class Product {
    // CAMPI DATI
    private readonly id: string;
    private readonly name: string;
    private readonly description: string;
    private readonly category: string;
    private readonly price: number;
    private readonly netPrice: number;
    private readonly tax: number;
    private readonly primaryPhoto: string;
    private readonly secondaryPhotos: Array<string>;
    private readonly stock: number;
    private readonly show: boolean;
    private readonly showHome: boolean;

    constructor (product: { [key: string]: any }) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.category = product.category;
        this.netPrice = product.netPrice;
        this.tax = product.tax;
        this.price = this.calculatePrice();
        this.stock = product.stock;
        this.show = product.show ? product.show : true;
        this.showHome = product.showHome ? product.showHome : false;
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
            this.category,this.price,this.secondaryPhotos && this.primaryPhoto && 
                this.stock && this.show && this.showHome);
    }

    // METODI PRIVATI
    private calculatePrice () {
        return this.netPrice * (this.tax / 100 + 1);
    }
}
