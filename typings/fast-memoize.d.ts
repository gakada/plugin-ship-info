declare module "fast-memoize" {
  export interface Cache<K, V> {
    get(key: K): V;
    set(key: K, value: V): void;
    has(key: K): boolean;
  }

  export interface Options<T> {
    cache?: Cache<any, any>;
    serializer?: (...args: any[]) => any;
    strategy?: (fn: T, options?: Options<T>) => T;
  }

  export default function memoize<T>(fn: T, options?: Options<T>): T;
}
