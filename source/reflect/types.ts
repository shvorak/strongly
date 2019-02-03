/**
 * Allowed type name
 */
export type TypeName = string | symbol;

/**
 * Allowed type member's name
 */
export type MemberName = string | symbol;

/**
 * Defined in type attribute item
 */
export type Attribute = {
    type: AttributeKey,
    value?: any,
    options: AttributeOptions;
};

/**
 * Allowed attribute name
 */
export type AttributeKey = symbol | object;

/**
 * Attribute usage options
 */
export type AttributeOptions = {
    multiple?: boolean;
    inherited?: boolean;
};
