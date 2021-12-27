// noinspection JSUnusedLocalSymbols

import {Equal, Expect} from '@type-challenges/utils';

type Values<S extends string, VS extends string[] = []> = S extends `${infer E},${infer REST}` ?
  Values<REST, [E, ...VS]> : VS extends [] ? S : [S, ...VS]

type SingleQuery<S extends string> = S extends '' ? {} :
  S extends `${infer K}=${infer V}` ? { [T in K]: Values<V> } :
    { [T in S]: true }


type ToArray<T> = T extends any[] ? T : [T]

type UnwrapValue<T> = T extends [any] ? T[0] : T

type DistinctArray<L extends any[], N extends any[]> = N extends [infer F, ...infer REST] ?
  F extends L[number] ? DistinctArray<L, REST> : DistinctArray<[...L, F], REST> :
  N extends [] ? L : never

type MergeValues<A, B> = UnwrapValue<DistinctArray<ToArray<A>, ToArray<B>>>

type MergeQuery<A, B> = {
  [K in keyof A | keyof B]: K extends keyof A ?
    (K extends keyof B ? MergeValues<A[K], B[K]> : A[K]) :
    (K extends keyof B ? B[K] : never)
}

type ParseQueryString<S extends string, R = {}> = S extends `${infer P}&${infer REST}` ?
  ParseQueryString<REST, MergeQuery<R, SingleQuery<P>>> :
  MergeQuery<R, SingleQuery<S>>

type cases = [
  Expect<Equal<ParseQueryString<''>, {}>>,
  Expect<Equal<ParseQueryString<'k1'>, { k1: true }>>,
  Expect<Equal<ParseQueryString<'k1&k1'>, { k1: true }>>,
  Expect<Equal<ParseQueryString<'k1&k2'>, { k1: true, k2: true }>>,
  Expect<Equal<ParseQueryString<'k1=v1'>, { k1: 'v1' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k1=v2'>, { k1: ['v1', 'v2'] }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k2=v2'>, { k1: 'v1', k2: 'v2' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k2=v2&k1=v2'>, { k1: ['v1', 'v2'], k2: 'v2' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k2'>, { k1: 'v1', k2: true }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k1=v1'>, { k1: 'v1' }>>
]
