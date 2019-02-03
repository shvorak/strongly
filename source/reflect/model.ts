import {findAttribute} from "./utils";
import {Constructable} from "../types";
import {Attribute, AttributeKey, MemberName, TypeName} from "./types";

export const TypeKey = Symbol('strongly.type');

export class BaseInfo {

    protected readonly _name: TypeName;

    protected readonly _base: BaseInfo;

    protected readonly _type: Constructable;

    protected readonly _attrs: Attribute[] = [];

    constructor(name: TypeName, type?: Constructable, base?: BaseInfo) {
        this._name = name;
        this._type = type;
        this._base = base;
    }

    public get name() {
        return this._name;
    }

    public get attributes(): Attribute[] {
        return this._attrs
            .concat((this._base ? this._base.attributes : []).filter(x => x.options.inherited === true))
            .slice()
    }

    public setAttribute(attr: Attribute) {
        attr.options = attr.options || {};
        if (attr.options.multiple === false && this.hasAttribute(attr.type))
            throw new Error("Attribute doesn't allow multiple usage");

        this._attrs.push(attr);
    }

    public hasAttribute(attr: AttributeKey): boolean {
        return this.attributes.some(findAttribute(attr));
    }

    public getAttribute(attr: AttributeKey): any;
    public getAttribute<T>(attr: Constructable<T>): T {
        let attribute = this.attributes.find(findAttribute(attr));
        if (attribute == null)
            throw new Error(`Attribute '${attr.toString()}' not found`);

        return attribute.value as T;
    }

    public getAttributes(attr: AttributeKey): any[];
    public getAttributes<T>(attr: Constructable<T>): T[] {
        // TODO: Add unique filter for inherited attributes but not multiple in overridden properties
        return this.attributes.filter(findAttribute(attr)).map(x => x.value)
    }

}

export class ClassInfo extends BaseInfo {

    private readonly _methods: MethodInfo[] = [];
    private readonly _properties: PropertyInfo[] = [];

    public get methods(): MethodInfo[] {
        return this._methods.slice()
            .concat((this._base instanceof ClassInfo ? this._base._methods : []));
    }

    public get ownMethods(): MethodInfo[] {
        return this._methods.slice();
    }

    public get properties(): PropertyInfo[] {
        return this._properties.slice()
            .concat((this._base instanceof ClassInfo ? this._base._properties : []));
    }

    public get ownProperties(): PropertyInfo[] {
        return this._properties.slice();
    }

    public hasMethod(name: MemberName): boolean {
        return this.methods.some(x => x.name === name);
    }

    public hasOwnMethod(name: MemberName): boolean {
        return this._methods.some(x => x.name === name);
    }

    public getMethod(name: MemberName, silent = false): MethodInfo {
        if (false === this.hasMethod(name) && silent === false) {
            throw new Error(`Method with name ${name.toString()} doesn't exists`);
        }
        return this.methods.find(x => x.name === name);
    }

    public getOwnMethod(name: MemberName, silent = false): MethodInfo {
        if (false === this.hasOwnMethod(name) && silent === false) {
            throw new Error(`Method with name ${name.toString()} doesn't exists`);
        }
        return this._methods.find(x => x.name === name);
    }

    public ensureMethod(name: MemberName): MethodInfo {
        if (false === this.hasOwnMethod(name)) {
            this._methods.push(new MethodInfo(name, this.getOwnMethod(name, true)))
        }
        return this.getMethod(name);
    }

    public hasProperty(name: MemberName): boolean {
        return this.properties.some(x => x.name === name);
    }

    public hasOwnProperty(name: MemberName): boolean {
        return this._properties.some(x => x.name === name);
    }

    public getProperty(name: MemberName, silent = false): PropertyInfo {
        if (false === this.hasProperty(name) && silent === false) {
            throw new Error(`Property with name ${name.toString()} doesn't exists`);
        }
        return this.properties.find(x => x.name === name);
    }

    public getOwnProperty(name: MemberName): PropertyInfo {
        if (false === this.hasOwnProperty(name)) {
            throw new Error(`Property with name ${name.toString()} doesn't exists`);
        }
        return this._properties.find(x => x.name === name);
    }

    public ensureProperty(name: MemberName, descriptor?: PropertyDescriptor): PropertyInfo {
        if (false === this.hasOwnProperty(name)) {
            // TODO: Check descriptor
            this._properties.push(new PropertyInfo(name, descriptor, this.getProperty(name, true)))
        }
        return this.getProperty(name);
    }

}

export class MethodInfo extends BaseInfo {

    private readonly _parameters: ParameterInfo[];

    constructor(name: MemberName, base?: MethodInfo) {
        super(name, null, base);
        this._parameters = []; // Replace with Reflect-Metadata
    }

    public get parameters() {
        return this._parameters.slice();
    }

    public hasParameter(index: number): boolean {
        return this._parameters.length > index && index >= 0 && this._parameters[index] != null;
    }

    public getParameter(index: number): ParameterInfo {
        return this._parameters[index];
    }

    public ensureParameter(index: number): ParameterInfo {
        if (false === this.hasParameter(index)) {
            this._parameters[index] = new ParameterInfo(index);
        }
        return this.getParameter(index);
    }

}

export class PropertyInfo extends BaseInfo {

    private readonly _descriptor: PropertyDescriptor;

    constructor(name: MemberName, descriptor: PropertyDescriptor, base?: PropertyInfo) {
        super(name, null, base);
        this._descriptor = descriptor;
    }

    public get readable() {
        return this._descriptor == null || this._descriptor.get !== void 0;
    }

    public get writable() {
        return this._descriptor == null || this._descriptor.set !== void 0;
    }

    public get propertyType(): Type {
        return this.hasAttribute(TypeKey) ? this.getAttribute(TypeKey) : undefined;
    }

}

export class ParameterInfo extends BaseInfo {

    private readonly _index: number;

    constructor(index: number) {
        super(index.toString());
        this._index = index;
    }

    public get index(): number {
        return this._index;
    }

    public get parameterType(): Type {
        return this.hasAttribute(TypeKey) ? this.getAttribute(TypeKey) : undefined;
    }

}


export class Type {

    public readonly type: Constructable;

    public readonly isList: boolean;

    constructor(type: Constructable, isList = false) {
        this.type = type;
        this.isList = isList;
    }

}