export type DeepReadonly<T> = [T] extends [Function]
  ? T
  : [T] extends [object]
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T

export type Serializable =
  | string
  | number
  | { [key: string]: Serializable }
  | Serializable[]
  | boolean
  | null
  | undefined
  | Date
  | Map<Serializable, Serializable>
  | Set<Serializable>
  | ((...args: any[]) => any)
  | RegExp
  | BigInt
