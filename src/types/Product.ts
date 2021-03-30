import { DYNAMO } from "src/utils/Dynamo";
// import List from 'typescript.list';

import { buildAjv } from 'src/utils/configAjv';
import Ajv from "ajv"
import { S3 as s3 } from "src/utils/s3"
const AJV: Ajv = buildAjv();

export default class Product {
    private static readonly TABLE = "products";

    // CAMPI DATI
    private readonly id: string;
    private readonly name: string;
    private readonly description: string;
    private readonly category: string;
    private readonly price: number;
    private readonly netPrice: number;
    private readonly tax: number;
    private readonly images: { [image: string]: any}

    // INTERFACCIA PUBBLICA
    public getJson(): JSON {
        const JSON_TMP = {
            id: this.id,
            name: this.name,
            description: this.description,
            category:this.category,
            price: this.price,
            netPrice: this.netPrice,
            tax: this.tax
        };
        return JSON.parse(JSON.stringify(JSON_TMP));
    }

    /**
     * 
     * @param id id of the product
     * @returns the product with the given id
     */
    public static async buildProduct(id: string): Promise<Product> {
        const PRODUCT_JSON: JSON =
            await DYNAMO.getIndexPartition(Product.TABLE, "id-index", "id", id, null) as JSON;
        if (PRODUCT_JSON == null) {
            console.log("Product " + id + " not found");
            return null;
        }
        console.log("Product " + id + ": " + JSON.stringify(PRODUCT_JSON));

        return new Product(PRODUCT_JSON[0])
    }

    /**
     * add a product to the database after having checked the data passed are correct 
     * @param data product data
     * @returns the result of the insertion
     */
    public static async createNewProduct(data: { [key: string]: any }):
        Promise<boolean> {

        // handle product image (only if there is an image)
        if (data.image) {
            try {
                const BUCKETNAME = process.env.PRODUCT_IMG_BUCKET;
                //DATA.image become an URL
                data.image = await s3.uploadImage(data.image, BUCKETNAME);
            }
            catch (err) {
                console.log(err.message)
                return false;
            }
        }

        //validate and add to db
        const VALID = AJV.validate("src/products/schema.json#/insertProduct", data);
        if (VALID) {
            const PRODUCT = await DYNAMO.write(Product.TABLE, data);
            return PRODUCT;
        }
        else {
            // i dati in ingresso per creare l'oggetto non rispettano lo json-schema
            return false;
        }
    }

    /**
     * 
     * @param PRODUCT_ID id of the product to be updated
     * @param DATA data to be updated
     * @returns the result of the query
    */
    public static async updateProduct(PRODUCT_ID: string, DATA: JSON):
        Promise<boolean> {
        //image replacing, if needed
        if (DATA['image']) {
            const BUCKETNAME = process.env.PRODUCT_IMG_BUCKET;
            s3.deleteFile(BUCKETNAME, DATA['image'].key)
            DATA['image'] = await s3.uploadImage(DATA['image'].imageCode, BUCKETNAME);
        }
        const VALID = AJV.validate("src/products/schema.json#/editProduct", DATA);
        if (VALID) {
            const PRODUCT = await DYNAMO.update(Product.TABLE, PRODUCT_ID, DATA);
            return PRODUCT;
        }
        else {
            // i dati in ingresso per modificare l'oggetto non rispettano lo json-schema
            return false;
        }
    }

    // TODO: per ora ho fatto una cosa semplice,
    //poi è il caso di creare tanti Product e ritornare Array<Product>?
    public static async buildAllProduct(DATA: JSON): Promise<Array<Product>> {
        console.log(DATA); //dati per filtrare e ordinare
        // TODO: Da aggiungere i filtri e ordinamento appena ci sarà il metodo disponibile in Dynamodb.ts
        const PRODUCTS_JSON = await DYNAMO.getScan(Product.TABLE);
        const PRODUCTS: Array<Product>=[]
        for (let i = 0; i < PRODUCTS_JSON.length; i++) {
            PRODUCTS.push(new Product(PRODUCTS_JSON[i]));
        }
        return PRODUCTS;
    }

    // METODI PRIVATI
    private constructor(product: {[key: string]: any}) {
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

    private calculatePrice() {
        return this.netPrice * (this.tax / 100 + 1)
    }
}
