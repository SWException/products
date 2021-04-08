import { Persistence } from "../repository/persistence"
import { Dynamo } from "src/repository/dynamo"
import { DbMock } from "../repository/dbMock";
import Product from "./product";
import { v4 as uuidv4 } from 'uuid';
import { buildAjv } from 'src/utils/configAjv';
import { S3 as s3 } from "src/repository/s3"
import Ajv from "ajv";

export class Model {
    private readonly DATABASE: Persistence;
    private readonly AJV: Ajv = buildAjv();
    private readonly TABLE = "products"

    private constructor(db: Persistence) {
        this.DATABASE = db;
    }

    public static createModel(): Model {
        return new Model(new Dynamo());
    }

    public static createModelMock(): Model {
        return new Model(new DbMock());
    }

    /**
         * 
         * @param id id of the product
         * @returns the product with the given id
         */
    public async buildProduct(id: string): Promise<Product> {
        const PRODUCT_JSON: JSON = await this.DATABASE.getIndexPartition(
            this.TABLE, "id-index", "id", id, null) as JSON;
        if (PRODUCT_JSON == null) {
            console.log("Product " + id + " not found");
            return null;
        }
        console.log("Product " + id + ": " + JSON.stringify(PRODUCT_JSON));

        return new Product(PRODUCT_JSON[0])
    }

    public async changeStock (id: string, quantity:number) {
        //TODO
    }

    /**
         * add a product to the database after having checked the data passed are correct 
         * @param data product data
         * @returns the result of the insertion
         */
    public async createNewProduct(data: { [key: string]: any }):
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
        const VALID = this.AJV.validate("src/products/schema.json#/insertProduct", data);
        if (VALID) {
            data.id = uuidv4();
            const PRODUCT = await this.DATABASE.write(this.TABLE, JSON.parse(JSON.stringify(data)));
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
    public async updateProduct(PRODUCT_ID: string, DATA: JSON):
        Promise<boolean> {
        //image replacing, if needed
        if (DATA['image']) {
            const BUCKETNAME = process.env.PRODUCT_IMG_BUCKET;
            s3.deleteFile(BUCKETNAME, DATA['image'].key)
            DATA['image'] = await s3.uploadImage(DATA['image'].imageCode, BUCKETNAME);
        }
        const VALID = this.AJV.validate("src/products/schema.json#/editProduct", DATA);
        if (VALID) {
            const PRODUCT = await this.DATABASE.update(this.TABLE, PRODUCT_ID, DATA);
            return PRODUCT;
        }
        else {
            // i dati in ingresso per modificare l'oggetto non rispettano lo json-schema
            return false;
        }
    }

    // TODO: per ora ho fatto una cosa semplice,
    //poi è il caso di creare tanti Product e ritornare Array<Product>?
    public async buildAllProduct(DATA: JSON): Promise<Array<Product>> {
        console.log(DATA); //dati per filtrare e ordinare
        // TODO: Da aggiungere i filtri e ordinamento 
        const PRODUCTS_JSON = await this.DATABASE.getScan(this.TABLE);
        const PRODUCTS: Array<Product> = []
        for (let i = 0; i < PRODUCTS_JSON.length; i++) {
            PRODUCTS.push(new Product(PRODUCTS_JSON[i]));
        }
        return PRODUCTS;
    }
}