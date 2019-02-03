import {getConstructor, getName, getParent, getToken} from "../source/utils";
import {Post, Comment, PromoPost} from "./_stubs/models";


test('get token for one type must be equal', () => {
    let token1 = getToken(Post);
    let token2 = getToken(Post);

    expect(token1).toEqual(token2);
});

test('get token for two types must be not equal', () => {
    let token1 = getToken(Post);
    let token2 = getToken(Comment);

    expect(token1).not.toEqual(token2);
});

test('get token must fail for non constructable type', () => {
    expect(() => getToken(1)).toThrow();
});

test('get base type', () => {
    expect(getParent(PromoPost)).toBe(Post);
    expect(getParent(new PromoPost())).toBe(Post);
});

test('get base type for non inherited type', () => {
    expect(getParent(Comment)).toBeUndefined();
});

test('get constructor type from any value', () => {
    expect(getConstructor(Post)).toBe(Post);
    expect(getConstructor(new Post())).toBe(Post);
});


test('get type token from Symbol type must return same Symbol', () => {
    const s = Symbol("s");
    expect(getToken(s)).toEqual(s);
});

test('get name from object value', () => {
    expect(getName({toString() {return ''}})).toEqual('')
});

test('get name from non handled type', () => {
    expect(getName(1)).toEqual(1);
});
