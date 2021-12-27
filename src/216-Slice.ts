import {Equal, Expect} from '@type-challenges/utils';


type Split<A extends any[], C extends number, L extends any[] = []> = C extends L['length'] ? [L, A] :
  A extends [infer F, ...infer REST] ? Split<REST, C, [...L, F]> : [[], []]

type NormalizeIndex<A extends any[], I extends number, R extends any[] = []> = `${I}` extends `-${infer E}`
  ? `${E}` extends `${R['length']}`
    ? Split<[...A, ...R], R['length']>[1]['length']
    : A extends [infer F, ...infer REST]
      ? NormalizeIndex<REST, I, [...R, F]>
      : never
  : I

type Slice<Arr extends any[], Start extends number = 0, End extends number = Arr['length']> =
  Split<Split<Arr, NormalizeIndex<Arr, End>>[0], NormalizeIndex<Arr, Start>>[1]

type Arr = [1, 2, 3, 4, 5]

type cases = [
  // basic
  Expect<Equal<Slice<Arr, 0, 1>, [1]>>,
  Expect<Equal<Slice<Arr, 0, 0>, []>>,
  Expect<Equal<Slice<Arr, 2, 4>, [3, 4]>>,

  // optional args
  Expect<Equal<Slice<[]>, []>>,
  Expect<Equal<Slice<Arr>, Arr>>,
  Expect<Equal<Slice<Arr, 0>, Arr>>,
  Expect<Equal<Slice<Arr, 2>, [3, 4, 5]>>,

  // negative index
  Expect<Equal<Slice<Arr, 0, -1>, [1, 2, 3, 4]>>,
  Expect<Equal<Slice<Arr, -3, -1>, [3, 4]>>,

  // invalid
  Expect<Equal<Slice<Arr, 10>, []>>,
  Expect<Equal<Slice<Arr, 1, 0>, []>>,
  Expect<Equal<Slice<Arr, 10, 20>, []>>,
]