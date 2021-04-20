// import Product from "../src/repository/product"
import { matchersWithOptions } from 'jest-json-schema';
import { JSONSchema7 } from "json-schema";
import { SCHEMAS, setFormats } from '../src/utils/configAjv';
import { Model } from 'src/core/model';

expect.extend(matchersWithOptions(SCHEMAS, (ajv) => setFormats(ajv)));

const PRODUCT_SCHEMA: JSONSchema7 = {
    $ref: "../schemas/products.json#/dbProduct"
};
const PRODUCTS_SCHEMA: JSONSchema7 = {
    $ref: "../schemas/products.json#/products"
};

test('schemas validation', () => {
    expect(PRODUCT_SCHEMA).toBeValidSchema();
    expect(PRODUCTS_SCHEMA).toBeValidSchema();
});

const MODEL = Model.createModelMock();
test('get product from database', async () => {
    const RES = (await MODEL.getProduct("1"));
    expect(RES).toMatchSchema(PRODUCT_SCHEMA);
});

test('insert product in the db', async () => {
    const RES = (await MODEL.addProduct({
        "productName": "mock product 1",
        "description": "this is a mock",
        "category": "1",
        "netPrice": 2.5,
        "tax": "1"
    }, "token"))
    expect(RES).toBe(true);
});

test('delete product from database', async () => {
    const RES = (await MODEL.deleteProduct("1", "token"));
    expect(RES).toBe(true);
});

test('update product in the database', async () => {
    const RES = (await MODEL.updateProduct("1", {
        "id": "1",
        "productName": "mock product 1",
        "description": "this is a mock",
        "category": "1",
        "netPrice": 2.5,
        "tax": "1"
    } ,"token"));
    expect(RES).toBe(true);
});

/*
test('get all products from database', async () => {
    const RES = (await Product.buildAllProduct(null));
    expect(RES).toMatchSchema(PRODUCTS_SCHEMA);
});

 */