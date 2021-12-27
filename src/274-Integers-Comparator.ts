import {Equal, Expect} from '@type-challenges/utils';

enum Comparison {
  Greater,
  Equal,
  Lower,
}

type Digit<T extends string, R extends any[] = []> = T extends `${infer A}e+${infer B}`
  ? B
  : T extends `${infer F}${infer REST}`
    ? Digit<REST, [...R, F]>
    : R extends [infer E, ...infer REST]
      ? `${REST['length']}`
      : never

type IsNeg<T extends number> = `${T}` extends `-${string}` ? true : false
type AbsStr<T extends number> = `${T}` extends `-${infer E}` ? E : `${T}`

type SingleDigitComparator<A extends string, B extends string, R extends any[] = []> = A extends `${R['length']}`
  ? B extends `${R['length']}`
    ? Comparison.Equal
    : Comparison.Lower
  : B extends `${R['length']}`
    ? Comparison.Greater
    : SingleDigitComparator<A, B, [...R, 0]>

type SameDigitComparator<A extends string, B extends string> = A extends `${infer A1}${infer AR}`
  ? B extends `${infer B1}${infer BR}`
    ? SingleDigitComparator<A1, B1> extends infer R
      ? R extends Comparison.Equal
        ? SameDigitComparator<AR, BR>
        : R
      : never
    : never
  : Comparison.Equal

type IntStringComparator<A extends string, B extends string> = A extends B
  ? Comparison.Equal
  : IntStringComparator<Digit<A>, Digit<B>> extends infer R
    ? R extends Comparison.Equal
      ? SameDigitComparator<A, B>
      : R
    : never

type Comparator<A extends number, B extends number> = A extends B
  ? Comparison.Equal
  : IsNeg<A> extends true
    ? IsNeg<B> extends true
      ? IntStringComparator<AbsStr<B>, AbsStr<A>>
      : Comparison.Lower
    : IsNeg<B> extends true
      ? Comparison.Greater
      : IntStringComparator<AbsStr<A>, AbsStr<B>>

type cases = [
  Expect<Equal<Comparator<1e64, 1e64>, Comparison.Equal>>,
  Expect<Equal<Comparator<1e64, 2e64>, Comparison.Lower>>,
  Expect<Equal<Comparator<1e65, 2e64>, Comparison.Greater>>,
  Expect<Equal<Comparator<3e64, 2e64>, Comparison.Greater>>,
  Expect<Equal<Comparator<1e21, 9e20>, Comparison.Greater>>,
  Expect<Equal<Comparator<5, 5>, Comparison.Equal>>,
  Expect<Equal<Comparator<5, 6>, Comparison.Lower>>,
  Expect<Equal<Comparator<5, 8>, Comparison.Lower>>,
  Expect<Equal<Comparator<5, 0>, Comparison.Greater>>,
  Expect<Equal<Comparator<-5, 0>, Comparison.Lower>>,
  Expect<Equal<Comparator<0, 0>, Comparison.Equal>>,
  Expect<Equal<Comparator<0, -5>, Comparison.Greater>>,
  Expect<Equal<Comparator<5, -3>, Comparison.Greater>>,
  Expect<Equal<Comparator<5, -7>, Comparison.Greater>>,
  Expect<Equal<Comparator<-5, -7>, Comparison.Greater>>,
  Expect<Equal<Comparator<-5, -3>, Comparison.Lower>>,
  Expect<Equal<Comparator<-25, -30>, Comparison.Greater>>,
  Expect<Equal<Comparator<15, -23>, Comparison.Greater>>,
  Expect<Equal<Comparator<40, 37>, Comparison.Greater>>,
  Expect<Equal<Comparator<-36, 36>, Comparison.Lower>>,
  Expect<Equal<Comparator<27, 27>, Comparison.Equal>>,
  Expect<Equal<Comparator<-38, -38>, Comparison.Equal>>,
]
