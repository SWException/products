import { Persistence } from "../repository/persistence/persistence"
import { Dynamo } from "src/repository/persistence/dynamo"
import { DbMock } from "../repository/persistence/dbMock";
import { Product } from "../repository/product";
import { v4 as uuidv4 } from 'uuid';
import { buildAjv } from 'src/utils/configAjv';
import { S3 as s3 } from "src/repository/persistence/s3"
import Ajv from "ajv";
import { Taxes } from "src/repository/taxes/taxes";
import { Categories } from "src/repository/categories/categories";
import { Users } from "src/repository/users/users";
import { UsersMock } from "src/repository/users/usersMock";
import { UsersService } from "src/repository/users/usersService";
import { TaxesService } from "src/repository/taxes/taxesService";
import { CategoriesService } from "src/repository/categories/categoriesService";
import { TaxesMock } from "src/repository/taxes/taxesMock";
import { CategoriesMock } from "src/repository/categories/categoriesMock";

export class Model {
    private readonly DATABASE: Persistence;
    private readonly AJV: Ajv = buildAjv();
    private static readonly TABLE = "products";
    private readonly USERS: Users;
    private readonly TAXES: Taxes;
    private readonly CATEGORIES: Categories;

    private constructor (db: Persistence, users: Users, taxes: Taxes, categories: Categories) {
        this.DATABASE = db;
        this.CATEGORIES=categories;
        this.TAXES=taxes;
        this.USERS=users;
    }

    public static createModel (): Model {
        return new Model(new Dynamo(), new UsersService(), new TaxesService(), new CategoriesService());
    }

    public static createModelMock (): Model {
        return new Model(new DbMock(), new UsersMock(), new TaxesMock(), new CategoriesMock());
    }

    /**
         * 
         * @param id id of the product
         * @returns the product with the given id
         */
    public async getProduct (id: string): Promise<Product> {

        const PRODUCT: Product = await this.DATABASE.get(Model.TABLE, id);
        if (PRODUCT == null) {
            console.log("Product " + id + " not found");
            return null;
        }
        console.log("Product " + id + ": " + JSON.stringify(PRODUCT));
        return PRODUCT;
    }

    public async changeStock (id: string, quantity: number, token: string): Promise<boolean> {
        //check if the user is vendor
        const IS_VENDOR = await this.USERS.checkVendor(token);
        if (!IS_VENDOR){
            throw new Error("invalid token");
        }
        return this.DATABASE.changeStock(Model.TABLE, id, quantity);
    }

    /**
         * add a product to the database after having checked the data passed are correct 
         * @param data product data
         * @returns the result of the insertion
         */
    public async createProduct (data: { [key: string]: any }, token: string):
        Promise<boolean> {
        //check if the user is vendor
        const IS_VENDOR = await this.USERS.checkVendor(token);
        if (!IS_VENDOR){
            throw new Error("invalid token");
        }

        // handle product image (only if there is an image)
        if (data.primaryPhoto) {
            try {
                const BUCKETNAME = process.env.PRODUCT_IMG_BUCKET;
                //DATA.image become an URL
                data.primaryPhoto = await s3.uploadImage(data.primaryPhoto, BUCKETNAME);
                if (data.secondaryPhotos) {
                    for (let i = 0; i < data.secondaryPhotos.length; i++) {
                        data.secondaryPhotos[i] = 
                        await s3.uploadImage(data.secondaryhotos[i], BUCKETNAME);
                    }
                }
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
            const RES: Promise<boolean> = this.DATABASE.write(Model.TABLE,
                JSON.parse(JSON.stringify(data)));
            return RES;
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
    public async updateProduct (PRODUCT_ID: string, DATA: JSON, token: string):
        Promise<boolean> {
        //check if the user is vendor
        const IS_VENDOR = await this.USERS.checkVendor(token);
        if (!IS_VENDOR){
            throw new Error("invalid token");
        }
        //image replacing, if needed
        if (DATA['primaryPhoto']) {
            const BUCKETNAME = process.env.PRODUCT_IMG_BUCKET;
            s3.deleteFile(BUCKETNAME, DATA['primaryPhoto'].key)
            DATA['primaryPhoto'] = await s3.uploadImage(DATA['primaryPhoto'], BUCKETNAME);
        }
        if (DATA['secondaryPhotos']) {
            const BUCKETNAME = process.env.PRODUCT_IMG_BUCKET;
            s3.deleteFile(BUCKETNAME, DATA[''].key)
            DATA['primaryPhoto'] = await s3.uploadImage(DATA['primaryPhoto'], BUCKETNAME);
        }

        const VALID = this.AJV.validate("src/products/schema.json#/editProduct", DATA);
        if (VALID) {
            const PRODUCT = await this.DATABASE.update(Model.TABLE, PRODUCT_ID, DATA);
            return PRODUCT;
        }
        else {
            // i dati in ingresso per modificare l'oggetto non rispettano lo json-schema
            return false;
        }
    }


    // TODO: per ora ho fatto una cosa semplice,
    //poi è il caso di creare tanti Product e ritornare Array<Product>?
    public async getAllProducts (DATA: JSON): Promise<Array<Product>> {
        console.log(DATA); //dati per filtrare e ordinare
        // TODO: Da aggiungere i filtri e ordinamento 
        const PRODUCTS_JSON = await this.DATABASE.getScan(Model.TABLE);
        const PRODUCTS: Array<Product> = []
        for (let i = 0; i < PRODUCTS_JSON.length; i++) {
            PRODUCTS.push(new Product(PRODUCTS_JSON[i]));
        }
        return PRODUCTS;
    }
}