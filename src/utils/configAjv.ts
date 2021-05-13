import responses from 'schemas/response.json';
import products from 'schemas/products.json';
import Ajv from 'ajv';
import { JSONSchema7 } from 'json-schema';

export const SCHEMAS = {
    schemas: [responses as JSONSchema7, products as JSONSchema7],
    strict: false
};

export function setFormats (ajv): void {
    ajv.addFormat("float", {
        type: "number",
        validate: /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/
    });

    ajv.addFormat("int64", { type: "number", validate: /^\d+$/ });
    ajv.addFormat("uri", { type: "string" });
}

export function buildAjv (): Ajv {
    const AJV: Ajv = new Ajv(SCHEMAS);
    setFormats(AJV);
    return AJV;
}
