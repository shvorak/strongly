/// <reference types="jest" />
/// <reference types="jest-extended" />

import {reflect} from "../source/index";
import {Author, Post, PromoPost} from "./_stubs/models";
import {AliasKey, Display, EmailValidator, IgnoreKey} from "./_stubs/attrs";


test('get single property attribute from type', () => {
    expect(reflect.getClassInfo(Post).hasProperty('title')).toBeTruthy();
    expect(reflect.getClassInfo(Post).getProperty('title').getAttribute(AliasKey)).toBe('title');
});

test('get single inherited property attribute from derived type', () => {
    expect(reflect.getClassInfo(PromoPost).getProperty('title').getAttribute(AliasKey)).toBe('title');
});

test('get single complex attribute', () => {
    let emailProp = reflect.getClassInfo(Author).getProperty('email');
    expect(emailProp.getAttribute(EmailValidator)).toBeInstanceOf(EmailValidator);
});

test('get collection of complex attributes', () => {
    let emailProp = reflect.getClassInfo(Author).getProperty('email');

    expect(emailProp.getAttribute(EmailValidator)).toBeInstanceOf(EmailValidator);

    expect(emailProp.getAttributes(EmailValidator))
        .toSatisfyAll((x => x instanceof EmailValidator) as any)
});


test('get method attribute', () => {
    const ref = reflect.getClassInfo(Author);

    expect(ref.getMethod('disable').hasAttribute(IgnoreKey)).toBeTruthy();

    expect(ref.hasProperty('disable')).toBeFalsy();
});

test('get class attribute', () => {
    expect(reflect.getClassInfo(Post).hasAttribute(AliasKey)).toBeTruthy();
    expect(reflect.getClassInfo(Post).getAttribute(AliasKey)).toEqual('test');
});

test('set multiple attributes that not allow multiple definitions', () => {
    expect(() => {
        class T {
            @Display("hello")
            @Display("hello2")
            public test: string;
        }
    }).toThrow();
});

test('get not defined attribute', () => {
    expect(() => reflect.getClassInfo(Post).getAttribute(Symbol('something'))).toThrow();
    expect(() => reflect.getClassInfo(Post).getAttribute(null)).toThrow();
});