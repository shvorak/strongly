import {reflect} from "./reflect";
import {Constructable} from "./types";
import {Type, TypeKey} from "./reflect/model";
import {AttributeKey, AttributeOptions} from "./reflect/types";

export type Decorators = ClassDecorator & PropertyDecorator & MethodDecorator & ParameterDecorator;


export function Attribute(type: object, options?: AttributeOptions): Decorators;
export function Attribute(type: symbol, value: any, options?: AttributeOptions): Decorators;

export function Attribute(type: AttributeKey, value?: any, options?: AttributeOptions): Decorators {
    if (typeof type !== "symbol") {
        options = value;
        value = null;
    }

    return (target, name?, option?) => {
        if (typeof target === 'function') {
            if (name) {
                // Static property decorator
                reflect.definePropertyAttribute(target, name, type, value, options);
            } else {
                // Class decorator
                reflect.defineClassAttribute(target, type, value, options);
            }
        } else {
            if (typeof option === 'number') {
                // Parameter decorator
                reflect.defineParameterAttribute(target, name, option, type, value, options);
            } else if (option === void 0) {
                // Property decorator
                reflect.definePropertyAttribute(target, name, type, value, options);
            } else if (option === null || typeof option === 'object' && option !== null) {
                // Method decorator or Getter/Setter
                if (typeof option.value === 'function') {
                    reflect.defineMethodAttribute(target, name, type, value, options);
                } else {
                    reflect.definePropertyAttribute(target, name, type, value, options, option);
                }
            } else {
                throw new Error('Invalid Attribute decorator call');
            }
        }
    }
}


export function TypeOf(type: Constructable): PropertyDecorator & ParameterDecorator {
    return Attribute(TypeKey, new Type(type), {multiple: false});
}

export function ListOf(type: Constructable): PropertyDecorator & ParameterDecorator {
    return Attribute(TypeKey, new Type(type, true), {multiple: false});
}