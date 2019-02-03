import {reflect} from "../source";
import {Author, Post, PromoPost} from "./_stubs/models";


test('get class info from non class type must be fail', () => {
    expect(() => reflect.getClassInfo(null)).toThrow()
});

test('get class info twice must return same ClassInfo instance', () => {
    expect(reflect.getClassInfo(Author)).toStrictEqual(reflect.getClassInfo(Author));
});

test('get class own properties', () => {
    expect(reflect.getClassInfo(PromoPost).ownProperties.length).toBe(2);
});

test('get getter property', () => {
    const ref = reflect.getClassInfo(Post).getProperty('date');
    expect(ref.readable).toBeTruthy();
    expect(ref.writable).toBeFalsy();
});

test('readable & writable simple property', () => {
    const ref = reflect.getClassInfo(Post).getProperty('title');
    expect(ref.readable).toBeTruthy();
    expect(ref.writable).toBeTruthy();
});

test('get property value type', () => {
    const ref = reflect.getClassInfo(PromoPost);
    const titleProp = ref.getProperty('title');

    expect(titleProp.propertyType).not.toBeUndefined();
    expect(titleProp.propertyType.isList).toBeFalsy();
    expect(titleProp.propertyType.type).toBe(String)
});

test('get method parameter value type', () => {
    const ref = reflect.getClassInfo(PromoPost);
    const notify = ref.getMethod('notify');

    expect(notify.hasParameter(0)).toBeTruthy();

    const notify0 = notify.getParameter(0);

    expect(notify0.parameterType).not.toBeUndefined();
    expect(notify0.parameterType.isList).toBeFalsy();
    expect(notify0.parameterType.type).toBe(Author)
});