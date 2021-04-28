import PRODUCTWITHIMAGE from "test/productwithimage"
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

test('get product', async () => {
    const RES = await MODEL.getProduct("1");
    expect(RES).toMatchSchema(PRODUCT_SCHEMA);
});

test('error get product', async () => {
    const RES = MODEL.getProduct(null);
    await expect(RES).rejects.toThrow(Error);
});

test('insert product', async () => {
    const RES = await MODEL.addProduct(PRODUCTWITHIMAGE, "token");
    expect(RES).toBe(true);
});

test('error insert product', async () => {
    const NEW_PRODUCT = {
        "name": "mock product 1",
        "description": "this is a mock",
        "category": "-1",
        "netPrice": 2.5,
        "tax": "-1"
    };
    const NEW_INCOMPLETE_PRODUCT = {
        "name": "mock product 1"
    };

    await expect(MODEL.addProduct(NEW_PRODUCT, null))
        .rejects.toThrow(Error);

    await expect(MODEL.addProduct(null, null))
        .rejects.toThrow(Error);

    await expect(MODEL.addProduct(null, "token"))
        .rejects.toThrow(Error);

    await expect(MODEL.addProduct(NEW_INCOMPLETE_PRODUCT, "token"))
        .rejects.toThrow(Error);
});

test('get home products', async () => {
    const RES = await MODEL.getHomeProducts();
    expect(RES).toMatchSchema(PRODUCTS_SCHEMA);
});

test('get products by category', async () => {
    let res = await MODEL.getProducts("-1", 3, 10, null);
    expect(res).toMatchSchema(PRODUCTS_SCHEMA);
    res = await MODEL.getProducts("-1", 3, 10, "desc");
    expect(res).toMatchSchema(PRODUCTS_SCHEMA);
    res = await MODEL.getProducts("-1", 3, 10, "asc");
    expect(res).toMatchSchema(PRODUCTS_SCHEMA);
    res = await MODEL.getProducts("-1", null, null, "asc");
    expect(res).toMatchSchema(PRODUCTS_SCHEMA);
    res = await MODEL.getProducts("-1", null, null, null);
    expect(res).toMatchSchema(PRODUCTS_SCHEMA);
    res = await MODEL.getProducts("-1", null, 10, null);
    expect(res).toMatchSchema(PRODUCTS_SCHEMA);
    res = await MODEL.getProducts("-1", 3, null, null);
    expect(res).toMatchSchema(PRODUCTS_SCHEMA);
});

test('error get products', async () => {
    await expect(MODEL.getProducts(null, 3, 10, "asc"))
        .rejects.toThrow(Error);
});

test('get products by name', async () => {
    const RES = await MODEL.getProductsByName("paperino");
    expect(RES).toMatchSchema(PRODUCTS_SCHEMA);
});

test('error get products by name', async () => {
    await expect(MODEL.getProductsByName(null))
        .rejects.toThrow(Error);
});

test('update product', async () => {
    const PRODUCT = {
        "id": "-1",
        "name": "mock product 1",
        "description": "this is a mock",
        "category": "-1",
        "netPrice": 2.5,
        "tax": "-1"
    };

    const RES = await MODEL.updateProduct(PRODUCT.id, PRODUCT, "token");
    expect(RES).toBe(true);
});

test('error update product', async () => {
    const PRODUCT = {
        "id": "-1",
        "name": "changed mock product 1",
        "description": "this is a change",
        "netPrice": 2.5,
    };
    await expect(MODEL.updateProduct(PRODUCT.id, PRODUCT, null))
        .rejects.toThrow(Error);

    await expect(MODEL.updateProduct(PRODUCT.id, null, "token"))
        .rejects.toThrow(Error);

    await expect(MODEL.updateProduct(null, PRODUCT, "token"))
        .rejects.toThrow(Error);
});

test('delete product', async () => {
    const RES = await MODEL.deleteProduct("-1", "token");
    expect(RES).toBe(true);
});

test('error delete product', async () => {
    await expect(MODEL.deleteProduct(null, "token"))
        .rejects.toThrow(Error);
    await expect(MODEL.deleteProduct("-1", null))
        .rejects.toThrow(Error);
});

test('change stock of a product', async () => {
    const RES = await MODEL.changeStock("-1", 3, "token");
    expect(RES).toBe(true);
    const RES_1 = await MODEL.changeStock("-1", -3, "token");
    expect(RES_1).toBe(true);
});

test('error change stock of a product', async () => {
    await expect(MODEL.changeStock("-1", 3, null))
        .rejects.toThrow(Error);
    await expect(MODEL.changeStock("-1", null, "token"))
        .rejects.toThrow(Error);
    await expect(MODEL.changeStock(null, 3, "token"))
        .rejects.toThrow(Error);
});
