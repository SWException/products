import { matchersWithOptions } from "jest-json-schema";
import { JSONSchema7 } from "json-schema";
import { Dynamo } from "src/repository/persistence/dynamo";
import { SCHEMAS, setFormats } from '../src/utils/configAjv';

expect.extend(matchersWithOptions(SCHEMAS, (ajv) => setFormats(ajv)));

const DYNAMO = new Dynamo();

const PRODUCT_SCHEMA: JSONSchema7 = {
    $ref: "../schemas/products.json#/dbProduct"
};
const PRODUCTS_SCHEMA: JSONSchema7 = {
    $ref: "../schemas/products.json#/products"
};

test('get product from database', async () => {
    const RES = (await DYNAMO.get("1"));
    expect(RES).toMatchSchema(PRODUCT_SCHEMA);
});

test('get products from database', async () => {
    const RES = (await DYNAMO.getCategoryPrice("1", 2, 10));
    expect(RES).toMatchSchema(PRODUCTS_SCHEMA);
});

test('update product in database', async () => {
    const RES = (await DYNAMO.update("1",{
        "id": "1",
        "netPrice": 3,
        "tax": "1"
    }));
    expect(RES).toBe(true);
});

test('add product to database', async () => {
    const RES = (await DYNAMO.write({
        "id": "2",
        "productName": "mock product",
        "description": "this is a mock",
        "category": "1",
        "netPrice": 7.2,
        "tax": "1"
    }));
    expect(RES).toBe(true);
});

test('remove product to database', async () => {
    const RES = (await DYNAMO.delete("2"));
    expect(RES).toBe(true);
});

