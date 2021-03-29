import Product from "../src/types/Product"
import { matchersWithOptions } from 'jest-json-schema';
import { JSONSchema7 } from "json-schema";
import { SCHEMAS, setFormats } from '../src/utils/configAjv';

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

test('get product from database', async () => {
    const RES = (await Product.buildProduct("1")).getJson();
    expect(RES).toMatchSchema(PRODUCT_SCHEMA);
});