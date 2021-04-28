// import Product from "../src/repository/product"
import { matchersWithOptions } from 'jest-json-schema';
import { JSONSchema7 } from "json-schema";
import { SCHEMAS, setFormats } from '../src/utils/configAjv';
import { Model } from 'src/core/model';

expect.extend(matchersWithOptions(SCHEMAS, (ajv) => setFormats(ajv)));

const PRODUCT_SCHEMA: JSONSchema7 = {
    $ref: "../schemas/products.json#/product"
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
        "name": "mock product 1",
        "description": "this is a mock",
        "category": "1",
        "netPrice": 2.5,
        "tax": "1"
    }, "token"))
    expect(RES).toBe(true);
});

test('get products from database', async () => {
    const RES = (await MODEL.getProducts("1", 3, 10, null));
    expect(RES).toMatchSchema(PRODUCTS_SCHEMA);
});

test('get products by name from database', async () => {
    const RES = (await MODEL.getProductsByName("paperino"));
    expect(RES).toMatchSchema(PRODUCTS_SCHEMA);
});


test('update product in the database', async () => {
    const RES = (await MODEL.updateProduct("1", {
        "id": "1",
        "name": "mock product 1",
        "description": "this is a mock",
        "category": "1",
        "netPrice": 2.5,
        "tax": "1"
    } ,"token"));
    expect(RES).toBe(true);
});

test('delete product in the database', async () => {
    const RES = (await MODEL.deleteProduct("1", "token"));
    expect(RES).toBe(true);
});

test('change stock of a product', async () => {
    const RES = (await MODEL.changeStock("1", 3 ,"token"));
    expect(RES).toBe(true);
});
