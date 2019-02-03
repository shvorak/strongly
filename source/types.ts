
export type Guid = string;

export type Func<TR> = () => TR;
export type Func1<T1, TR> = (x: T1) => TR;
export type Func2<T1, T2, TR> = (x: T1, y: T2) => TR;
export type Func3<T1, T2, T3, TR> = (x: T1, y: T2, z: T3) => TR;

export type Action<T1> = (x: T1) => any;
export type Action2<T1, T2> = (x: T1, y: T2) => any;


export interface Dictionary<T> {
    [index: string]: T
}

export interface Constructable<T = any>
{
    new(...args : any[]) : T;

    prototype : T;
}