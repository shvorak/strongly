import {Attribute, AttributeOptions} from "./types";

export const findAttribute = (attr: any) => (x: Attribute) => x.type === attr || typeof attr === 'function' && x.type instanceof attr;

export const makeAttribute = (attr: any, value?: any, options?: AttributeOptions): Attribute => {
    return {
        type: attr,
        value: typeof attr === 'object' ? attr : value,
        options: options
    }
};