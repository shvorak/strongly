import {getConstructor, getName, getParent, getToken} from "./utils";
import {makeAttribute} from "./reflect/utils";
import {AttributeKey, AttributeOptions, MemberName} from "./reflect/types";
import {ClassInfo} from "./reflect/model";

const Classes = {};
const InfoKey = Symbol('strongly.info');


export class reflect
{

    public static getClassInfo(target : any | symbol) : ClassInfo {
        // TODO : Refactoring
        try {
            let token = getToken(target);

            if (Classes.hasOwnProperty(token))
                return Classes[token];

            let type = getConstructor(target);

            let baseInfo;
            let baseType = getParent(type);
            if (baseType) {
                baseInfo = reflect.getClassInfo(baseType);
            }

            return Classes[token] = type[InfoKey] = new ClassInfo(getName(type), type, baseInfo);

        } catch (e) {
            throw new Error(`Invalid class type`);
        }
    }

    public static defineClassAttribute(target : any, type : AttributeKey, value? : any, options?: AttributeOptions) {
        reflect.getClassInfo(target)
            .setAttribute(makeAttribute(type, value, options));
    }

    public static defineMethodAttribute(target : any, name : MemberName, type : AttributeKey, value? : any, options?: AttributeOptions) {
        reflect.getClassInfo(target)
            .ensureMethod(name)
            .setAttribute(makeAttribute(type, value, options));
    }

    public static definePropertyAttribute(target : any, name : MemberName, type : AttributeKey, value? : any, options?: AttributeOptions, descriptor?: PropertyDescriptor) {
        reflect.getClassInfo(target)
            .ensureProperty(name, descriptor)
            .setAttribute(makeAttribute(type, value, options));
    }

    public static defineParameterAttribute(target : any, name : MemberName, index : number, type : AttributeKey, value? : any, options?: AttributeOptions) {
        reflect.getClassInfo(target)
            .ensureMethod(name).ensureParameter(index)
            .setAttribute(makeAttribute(type, value, options));
    }
}