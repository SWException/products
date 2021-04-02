

export default class Product {

    // CAMPI DATI
    private readonly id: string;
    private readonly name: string;
    private readonly description: string;
    private readonly category: string;
    private readonly price: number;
    private readonly netPrice: number;
    private readonly tax: number;
    private readonly images: { [image: string]: any}

    
    constructor(product: {[key: string]: any}) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.category = product.category;
        this.netPrice = product.netPrice;
        this.tax = product.tax;
        this.price = this.calculatePrice();
        if (product.images) {
            for(let i=0; i<product.images.length; i++) {
                this.images[i]={image: product.images.image[i]}
            }
        }
        else {
            this.images=[];
        }
    }
    
    // METODI PRIVATI
    private calculatePrice() {
        return this.netPrice * (this.tax / 100 + 1)
    }
}
