const TokenKey = Symbol('strongly.type.token');

export function getName(source: any): string {
    if (typeof source === 'function')
        return source.name;

    if (typeof source === 'object' && source != null)
        return source.toString();

    return source;
}

/**
 * Return unique token value for the type
 *
 * @param target
 * @throws Error
 * @return symbol
 */
export function getToken(target: any): symbol {
    if (typeof target === 'symbol') {
        return target;
    }
    let constructor = getConstructor(target);
    if (constructor == null) {
        throw new Error(`Can't retrieve constructor from value "${target}"`);
    }

    if (constructor.hasOwnProperty(TokenKey) === false) {
        // No need to generate random token because Symbol('1') !== Symbol('1')
        constructor[TokenKey] = Symbol(`strongly.type`)
    }

    return constructor[TokenKey];
}

/**
 * Returns base type except standard types
 *
 * @param {*} target
 * @returns {Function?}
 */
export function getParent(target: any) {
    let constructor = Object.getPrototypeOf(getConstructor(target).prototype).constructor;
    if (constructor === Object || constructor === Function) {
        return void 0;
    }

    return constructor;
}

/**
 * Returns type constructor
 *
 * @param {*} target
 * @returns {Function?}
 */
export function getConstructor(target: any) {
    if (typeof target === 'function') {
        return target;
    }
    if (typeof target === 'object' && target !== null) {
        return target.constructor;
    }
    return void 0;
}