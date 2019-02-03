import {Attribute} from "../../source/attrs";

export const AliasKey = Symbol('alias');
export const IgnoreKey = Symbol('ignore');
export const DisplayKey = Symbol('display');

export const Alias = (name: string) => Attribute(AliasKey, name, {inherited: true});
export const Ignore = Attribute(IgnoreKey, true, {inherited: true});
export const Display = (name: string) => Attribute(DisplayKey, name, {inherited: true, multiple: false});


export class EmailValidator {

}

export const Email = () => Attribute(new EmailValidator());
