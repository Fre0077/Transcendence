
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Metadata
 * 
 */
export type Metadata = $Result.DefaultSelection<Prisma.$MetadataPayload>
/**
 * Model Game
 * 
 */
export type Game = $Result.DefaultSelection<Prisma.$GamePayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Metadata
 * const metadata = await prisma.metadata.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Metadata
   * const metadata = await prisma.metadata.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.metadata`: Exposes CRUD operations for the **Metadata** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Metadata
    * const metadata = await prisma.metadata.findMany()
    * ```
    */
  get metadata(): Prisma.MetadataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.game`: Exposes CRUD operations for the **Game** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Games
    * const games = await prisma.game.findMany()
    * ```
    */
  get game(): Prisma.GameDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.11.0
   * Query Engine version: 9c30299f5a0ea26a96790e13f796dc6094db3173
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Metadata: 'Metadata',
    Game: 'Game',
    User: 'User'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "metadata" | "game" | "user"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Metadata: {
        payload: Prisma.$MetadataPayload<ExtArgs>
        fields: Prisma.MetadataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MetadataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetadataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MetadataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetadataPayload>
          }
          findFirst: {
            args: Prisma.MetadataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetadataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MetadataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetadataPayload>
          }
          findMany: {
            args: Prisma.MetadataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetadataPayload>[]
          }
          create: {
            args: Prisma.MetadataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetadataPayload>
          }
          createMany: {
            args: Prisma.MetadataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MetadataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetadataPayload>[]
          }
          delete: {
            args: Prisma.MetadataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetadataPayload>
          }
          update: {
            args: Prisma.MetadataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetadataPayload>
          }
          deleteMany: {
            args: Prisma.MetadataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MetadataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MetadataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetadataPayload>[]
          }
          upsert: {
            args: Prisma.MetadataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetadataPayload>
          }
          aggregate: {
            args: Prisma.MetadataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMetadata>
          }
          groupBy: {
            args: Prisma.MetadataGroupByArgs<ExtArgs>
            result: $Utils.Optional<MetadataGroupByOutputType>[]
          }
          count: {
            args: Prisma.MetadataCountArgs<ExtArgs>
            result: $Utils.Optional<MetadataCountAggregateOutputType> | number
          }
        }
      }
      Game: {
        payload: Prisma.$GamePayload<ExtArgs>
        fields: Prisma.GameFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          findFirst: {
            args: Prisma.GameFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          findMany: {
            args: Prisma.GameFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          create: {
            args: Prisma.GameCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          createMany: {
            args: Prisma.GameCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          delete: {
            args: Prisma.GameDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          update: {
            args: Prisma.GameUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          deleteMany: {
            args: Prisma.GameDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          upsert: {
            args: Prisma.GameUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          aggregate: {
            args: Prisma.GameAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGame>
          }
          groupBy: {
            args: Prisma.GameGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameCountArgs<ExtArgs>
            result: $Utils.Optional<GameCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    metadata?: MetadataOmit
    game?: GameOmit
    user?: UserOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type GameCountOutputType
   */

  export type GameCountOutputType = {
    players: number
  }

  export type GameCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    players?: boolean | GameCountOutputTypeCountPlayersArgs
  }

  // Custom InputTypes
  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameCountOutputType
     */
    select?: GameCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeCountPlayersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    friends: number
    friendOf: number
    incomingRequests: number
    outgoingRequests: number
    history: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    friends?: boolean | UserCountOutputTypeCountFriendsArgs
    friendOf?: boolean | UserCountOutputTypeCountFriendOfArgs
    incomingRequests?: boolean | UserCountOutputTypeCountIncomingRequestsArgs
    outgoingRequests?: boolean | UserCountOutputTypeCountOutgoingRequestsArgs
    history?: boolean | UserCountOutputTypeCountHistoryArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFriendsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFriendOfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountIncomingRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOutgoingRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Metadata
   */

  export type AggregateMetadata = {
    _count: MetadataCountAggregateOutputType | null
    _min: MetadataMinAggregateOutputType | null
    _max: MetadataMaxAggregateOutputType | null
  }

  export type MetadataMinAggregateOutputType = {
    id: string | null
    origin: string | null
    originId: string | null
    room: string | null
  }

  export type MetadataMaxAggregateOutputType = {
    id: string | null
    origin: string | null
    originId: string | null
    room: string | null
  }

  export type MetadataCountAggregateOutputType = {
    id: number
    origin: number
    originId: number
    room: number
    _all: number
  }


  export type MetadataMinAggregateInputType = {
    id?: true
    origin?: true
    originId?: true
    room?: true
  }

  export type MetadataMaxAggregateInputType = {
    id?: true
    origin?: true
    originId?: true
    room?: true
  }

  export type MetadataCountAggregateInputType = {
    id?: true
    origin?: true
    originId?: true
    room?: true
    _all?: true
  }

  export type MetadataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Metadata to aggregate.
     */
    where?: MetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metadata to fetch.
     */
    orderBy?: MetadataOrderByWithRelationInput | MetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Metadata
    **/
    _count?: true | MetadataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MetadataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MetadataMaxAggregateInputType
  }

  export type GetMetadataAggregateType<T extends MetadataAggregateArgs> = {
        [P in keyof T & keyof AggregateMetadata]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMetadata[P]>
      : GetScalarType<T[P], AggregateMetadata[P]>
  }




  export type MetadataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetadataWhereInput
    orderBy?: MetadataOrderByWithAggregationInput | MetadataOrderByWithAggregationInput[]
    by: MetadataScalarFieldEnum[] | MetadataScalarFieldEnum
    having?: MetadataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MetadataCountAggregateInputType | true
    _min?: MetadataMinAggregateInputType
    _max?: MetadataMaxAggregateInputType
  }

  export type MetadataGroupByOutputType = {
    id: string
    origin: string
    originId: string
    room: string | null
    _count: MetadataCountAggregateOutputType | null
    _min: MetadataMinAggregateOutputType | null
    _max: MetadataMaxAggregateOutputType | null
  }

  type GetMetadataGroupByPayload<T extends MetadataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MetadataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MetadataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MetadataGroupByOutputType[P]>
            : GetScalarType<T[P], MetadataGroupByOutputType[P]>
        }
      >
    >


  export type MetadataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    origin?: boolean
    originId?: boolean
    room?: boolean
    game?: boolean | Metadata$gameArgs<ExtArgs>
  }, ExtArgs["result"]["metadata"]>

  export type MetadataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    origin?: boolean
    originId?: boolean
    room?: boolean
  }, ExtArgs["result"]["metadata"]>

  export type MetadataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    origin?: boolean
    originId?: boolean
    room?: boolean
  }, ExtArgs["result"]["metadata"]>

  export type MetadataSelectScalar = {
    id?: boolean
    origin?: boolean
    originId?: boolean
    room?: boolean
  }

  export type MetadataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "origin" | "originId" | "room", ExtArgs["result"]["metadata"]>
  export type MetadataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    game?: boolean | Metadata$gameArgs<ExtArgs>
  }
  export type MetadataIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MetadataIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MetadataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Metadata"
    objects: {
      game: Prisma.$GamePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      origin: string
      originId: string
      room: string | null
    }, ExtArgs["result"]["metadata"]>
    composites: {}
  }

  type MetadataGetPayload<S extends boolean | null | undefined | MetadataDefaultArgs> = $Result.GetResult<Prisma.$MetadataPayload, S>

  type MetadataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MetadataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MetadataCountAggregateInputType | true
    }

  export interface MetadataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Metadata'], meta: { name: 'Metadata' } }
    /**
     * Find zero or one Metadata that matches the filter.
     * @param {MetadataFindUniqueArgs} args - Arguments to find a Metadata
     * @example
     * // Get one Metadata
     * const metadata = await prisma.metadata.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MetadataFindUniqueArgs>(args: SelectSubset<T, MetadataFindUniqueArgs<ExtArgs>>): Prisma__MetadataClient<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Metadata that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MetadataFindUniqueOrThrowArgs} args - Arguments to find a Metadata
     * @example
     * // Get one Metadata
     * const metadata = await prisma.metadata.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MetadataFindUniqueOrThrowArgs>(args: SelectSubset<T, MetadataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MetadataClient<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Metadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetadataFindFirstArgs} args - Arguments to find a Metadata
     * @example
     * // Get one Metadata
     * const metadata = await prisma.metadata.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MetadataFindFirstArgs>(args?: SelectSubset<T, MetadataFindFirstArgs<ExtArgs>>): Prisma__MetadataClient<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Metadata that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetadataFindFirstOrThrowArgs} args - Arguments to find a Metadata
     * @example
     * // Get one Metadata
     * const metadata = await prisma.metadata.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MetadataFindFirstOrThrowArgs>(args?: SelectSubset<T, MetadataFindFirstOrThrowArgs<ExtArgs>>): Prisma__MetadataClient<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Metadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetadataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Metadata
     * const metadata = await prisma.metadata.findMany()
     * 
     * // Get first 10 Metadata
     * const metadata = await prisma.metadata.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const metadataWithIdOnly = await prisma.metadata.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MetadataFindManyArgs>(args?: SelectSubset<T, MetadataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Metadata.
     * @param {MetadataCreateArgs} args - Arguments to create a Metadata.
     * @example
     * // Create one Metadata
     * const Metadata = await prisma.metadata.create({
     *   data: {
     *     // ... data to create a Metadata
     *   }
     * })
     * 
     */
    create<T extends MetadataCreateArgs>(args: SelectSubset<T, MetadataCreateArgs<ExtArgs>>): Prisma__MetadataClient<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Metadata.
     * @param {MetadataCreateManyArgs} args - Arguments to create many Metadata.
     * @example
     * // Create many Metadata
     * const metadata = await prisma.metadata.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MetadataCreateManyArgs>(args?: SelectSubset<T, MetadataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Metadata and returns the data saved in the database.
     * @param {MetadataCreateManyAndReturnArgs} args - Arguments to create many Metadata.
     * @example
     * // Create many Metadata
     * const metadata = await prisma.metadata.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Metadata and only return the `id`
     * const metadataWithIdOnly = await prisma.metadata.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MetadataCreateManyAndReturnArgs>(args?: SelectSubset<T, MetadataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Metadata.
     * @param {MetadataDeleteArgs} args - Arguments to delete one Metadata.
     * @example
     * // Delete one Metadata
     * const Metadata = await prisma.metadata.delete({
     *   where: {
     *     // ... filter to delete one Metadata
     *   }
     * })
     * 
     */
    delete<T extends MetadataDeleteArgs>(args: SelectSubset<T, MetadataDeleteArgs<ExtArgs>>): Prisma__MetadataClient<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Metadata.
     * @param {MetadataUpdateArgs} args - Arguments to update one Metadata.
     * @example
     * // Update one Metadata
     * const metadata = await prisma.metadata.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MetadataUpdateArgs>(args: SelectSubset<T, MetadataUpdateArgs<ExtArgs>>): Prisma__MetadataClient<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Metadata.
     * @param {MetadataDeleteManyArgs} args - Arguments to filter Metadata to delete.
     * @example
     * // Delete a few Metadata
     * const { count } = await prisma.metadata.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MetadataDeleteManyArgs>(args?: SelectSubset<T, MetadataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Metadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetadataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Metadata
     * const metadata = await prisma.metadata.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MetadataUpdateManyArgs>(args: SelectSubset<T, MetadataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Metadata and returns the data updated in the database.
     * @param {MetadataUpdateManyAndReturnArgs} args - Arguments to update many Metadata.
     * @example
     * // Update many Metadata
     * const metadata = await prisma.metadata.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Metadata and only return the `id`
     * const metadataWithIdOnly = await prisma.metadata.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MetadataUpdateManyAndReturnArgs>(args: SelectSubset<T, MetadataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Metadata.
     * @param {MetadataUpsertArgs} args - Arguments to update or create a Metadata.
     * @example
     * // Update or create a Metadata
     * const metadata = await prisma.metadata.upsert({
     *   create: {
     *     // ... data to create a Metadata
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Metadata we want to update
     *   }
     * })
     */
    upsert<T extends MetadataUpsertArgs>(args: SelectSubset<T, MetadataUpsertArgs<ExtArgs>>): Prisma__MetadataClient<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Metadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetadataCountArgs} args - Arguments to filter Metadata to count.
     * @example
     * // Count the number of Metadata
     * const count = await prisma.metadata.count({
     *   where: {
     *     // ... the filter for the Metadata we want to count
     *   }
     * })
    **/
    count<T extends MetadataCountArgs>(
      args?: Subset<T, MetadataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MetadataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Metadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetadataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MetadataAggregateArgs>(args: Subset<T, MetadataAggregateArgs>): Prisma.PrismaPromise<GetMetadataAggregateType<T>>

    /**
     * Group by Metadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetadataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MetadataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MetadataGroupByArgs['orderBy'] }
        : { orderBy?: MetadataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MetadataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMetadataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Metadata model
   */
  readonly fields: MetadataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Metadata.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MetadataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    game<T extends Metadata$gameArgs<ExtArgs> = {}>(args?: Subset<T, Metadata$gameArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Metadata model
   */
  interface MetadataFieldRefs {
    readonly id: FieldRef<"Metadata", 'String'>
    readonly origin: FieldRef<"Metadata", 'String'>
    readonly originId: FieldRef<"Metadata", 'String'>
    readonly room: FieldRef<"Metadata", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Metadata findUnique
   */
  export type MetadataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetadataInclude<ExtArgs> | null
    /**
     * Filter, which Metadata to fetch.
     */
    where: MetadataWhereUniqueInput
  }

  /**
   * Metadata findUniqueOrThrow
   */
  export type MetadataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetadataInclude<ExtArgs> | null
    /**
     * Filter, which Metadata to fetch.
     */
    where: MetadataWhereUniqueInput
  }

  /**
   * Metadata findFirst
   */
  export type MetadataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetadataInclude<ExtArgs> | null
    /**
     * Filter, which Metadata to fetch.
     */
    where?: MetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metadata to fetch.
     */
    orderBy?: MetadataOrderByWithRelationInput | MetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Metadata.
     */
    cursor?: MetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Metadata.
     */
    distinct?: MetadataScalarFieldEnum | MetadataScalarFieldEnum[]
  }

  /**
   * Metadata findFirstOrThrow
   */
  export type MetadataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetadataInclude<ExtArgs> | null
    /**
     * Filter, which Metadata to fetch.
     */
    where?: MetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metadata to fetch.
     */
    orderBy?: MetadataOrderByWithRelationInput | MetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Metadata.
     */
    cursor?: MetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Metadata.
     */
    distinct?: MetadataScalarFieldEnum | MetadataScalarFieldEnum[]
  }

  /**
   * Metadata findMany
   */
  export type MetadataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetadataInclude<ExtArgs> | null
    /**
     * Filter, which Metadata to fetch.
     */
    where?: MetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Metadata to fetch.
     */
    orderBy?: MetadataOrderByWithRelationInput | MetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Metadata.
     */
    cursor?: MetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Metadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Metadata.
     */
    skip?: number
    distinct?: MetadataScalarFieldEnum | MetadataScalarFieldEnum[]
  }

  /**
   * Metadata create
   */
  export type MetadataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetadataInclude<ExtArgs> | null
    /**
     * The data needed to create a Metadata.
     */
    data: XOR<MetadataCreateInput, MetadataUncheckedCreateInput>
  }

  /**
   * Metadata createMany
   */
  export type MetadataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Metadata.
     */
    data: MetadataCreateManyInput | MetadataCreateManyInput[]
  }

  /**
   * Metadata createManyAndReturn
   */
  export type MetadataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * The data used to create many Metadata.
     */
    data: MetadataCreateManyInput | MetadataCreateManyInput[]
  }

  /**
   * Metadata update
   */
  export type MetadataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetadataInclude<ExtArgs> | null
    /**
     * The data needed to update a Metadata.
     */
    data: XOR<MetadataUpdateInput, MetadataUncheckedUpdateInput>
    /**
     * Choose, which Metadata to update.
     */
    where: MetadataWhereUniqueInput
  }

  /**
   * Metadata updateMany
   */
  export type MetadataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Metadata.
     */
    data: XOR<MetadataUpdateManyMutationInput, MetadataUncheckedUpdateManyInput>
    /**
     * Filter which Metadata to update
     */
    where?: MetadataWhereInput
    /**
     * Limit how many Metadata to update.
     */
    limit?: number
  }

  /**
   * Metadata updateManyAndReturn
   */
  export type MetadataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * The data used to update Metadata.
     */
    data: XOR<MetadataUpdateManyMutationInput, MetadataUncheckedUpdateManyInput>
    /**
     * Filter which Metadata to update
     */
    where?: MetadataWhereInput
    /**
     * Limit how many Metadata to update.
     */
    limit?: number
  }

  /**
   * Metadata upsert
   */
  export type MetadataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetadataInclude<ExtArgs> | null
    /**
     * The filter to search for the Metadata to update in case it exists.
     */
    where: MetadataWhereUniqueInput
    /**
     * In case the Metadata found by the `where` argument doesn't exist, create a new Metadata with this data.
     */
    create: XOR<MetadataCreateInput, MetadataUncheckedCreateInput>
    /**
     * In case the Metadata was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MetadataUpdateInput, MetadataUncheckedUpdateInput>
  }

  /**
   * Metadata delete
   */
  export type MetadataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetadataInclude<ExtArgs> | null
    /**
     * Filter which Metadata to delete.
     */
    where: MetadataWhereUniqueInput
  }

  /**
   * Metadata deleteMany
   */
  export type MetadataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Metadata to delete
     */
    where?: MetadataWhereInput
    /**
     * Limit how many Metadata to delete.
     */
    limit?: number
  }

  /**
   * Metadata.game
   */
  export type Metadata$gameArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    where?: GameWhereInput
  }

  /**
   * Metadata without action
   */
  export type MetadataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetadataInclude<ExtArgs> | null
  }


  /**
   * Model Game
   */

  export type AggregateGame = {
    _count: GameCountAggregateOutputType | null
    _avg: GameAvgAggregateOutputType | null
    _sum: GameSumAggregateOutputType | null
    _min: GameMinAggregateOutputType | null
    _max: GameMaxAggregateOutputType | null
  }

  export type GameAvgAggregateOutputType = {
    id: number | null
  }

  export type GameSumAggregateOutputType = {
    id: number | null
  }

  export type GameMinAggregateOutputType = {
    id: number | null
    game: string | null
    gameId: string | null
    winner: string | null
    score: string | null
    replay: string | null
    gamePlayers: string | null
    metadataId: string | null
  }

  export type GameMaxAggregateOutputType = {
    id: number | null
    game: string | null
    gameId: string | null
    winner: string | null
    score: string | null
    replay: string | null
    gamePlayers: string | null
    metadataId: string | null
  }

  export type GameCountAggregateOutputType = {
    id: number
    game: number
    gameId: number
    winner: number
    score: number
    replay: number
    gamePlayers: number
    metadataId: number
    _all: number
  }


  export type GameAvgAggregateInputType = {
    id?: true
  }

  export type GameSumAggregateInputType = {
    id?: true
  }

  export type GameMinAggregateInputType = {
    id?: true
    game?: true
    gameId?: true
    winner?: true
    score?: true
    replay?: true
    gamePlayers?: true
    metadataId?: true
  }

  export type GameMaxAggregateInputType = {
    id?: true
    game?: true
    gameId?: true
    winner?: true
    score?: true
    replay?: true
    gamePlayers?: true
    metadataId?: true
  }

  export type GameCountAggregateInputType = {
    id?: true
    game?: true
    gameId?: true
    winner?: true
    score?: true
    replay?: true
    gamePlayers?: true
    metadataId?: true
    _all?: true
  }

  export type GameAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Game to aggregate.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Games
    **/
    _count?: true | GameCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameMaxAggregateInputType
  }

  export type GetGameAggregateType<T extends GameAggregateArgs> = {
        [P in keyof T & keyof AggregateGame]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGame[P]>
      : GetScalarType<T[P], AggregateGame[P]>
  }




  export type GameGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
    orderBy?: GameOrderByWithAggregationInput | GameOrderByWithAggregationInput[]
    by: GameScalarFieldEnum[] | GameScalarFieldEnum
    having?: GameScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameCountAggregateInputType | true
    _avg?: GameAvgAggregateInputType
    _sum?: GameSumAggregateInputType
    _min?: GameMinAggregateInputType
    _max?: GameMaxAggregateInputType
  }

  export type GameGroupByOutputType = {
    id: number
    game: string
    gameId: string
    winner: string
    score: string
    replay: string
    gamePlayers: string
    metadataId: string | null
    _count: GameCountAggregateOutputType | null
    _avg: GameAvgAggregateOutputType | null
    _sum: GameSumAggregateOutputType | null
    _min: GameMinAggregateOutputType | null
    _max: GameMaxAggregateOutputType | null
  }

  type GetGameGroupByPayload<T extends GameGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameGroupByOutputType[P]>
            : GetScalarType<T[P], GameGroupByOutputType[P]>
        }
      >
    >


  export type GameSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game?: boolean
    gameId?: boolean
    winner?: boolean
    score?: boolean
    replay?: boolean
    gamePlayers?: boolean
    metadataId?: boolean
    players?: boolean | Game$playersArgs<ExtArgs>
    metadata?: boolean | Game$metadataArgs<ExtArgs>
    _count?: boolean | GameCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game?: boolean
    gameId?: boolean
    winner?: boolean
    score?: boolean
    replay?: boolean
    gamePlayers?: boolean
    metadataId?: boolean
    metadata?: boolean | Game$metadataArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    game?: boolean
    gameId?: boolean
    winner?: boolean
    score?: boolean
    replay?: boolean
    gamePlayers?: boolean
    metadataId?: boolean
    metadata?: boolean | Game$metadataArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectScalar = {
    id?: boolean
    game?: boolean
    gameId?: boolean
    winner?: boolean
    score?: boolean
    replay?: boolean
    gamePlayers?: boolean
    metadataId?: boolean
  }

  export type GameOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "game" | "gameId" | "winner" | "score" | "replay" | "gamePlayers" | "metadataId", ExtArgs["result"]["game"]>
  export type GameInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    players?: boolean | Game$playersArgs<ExtArgs>
    metadata?: boolean | Game$metadataArgs<ExtArgs>
    _count?: boolean | GameCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GameIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    metadata?: boolean | Game$metadataArgs<ExtArgs>
  }
  export type GameIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    metadata?: boolean | Game$metadataArgs<ExtArgs>
  }

  export type $GamePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Game"
    objects: {
      players: Prisma.$UserPayload<ExtArgs>[]
      metadata: Prisma.$MetadataPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      game: string
      gameId: string
      winner: string
      score: string
      replay: string
      gamePlayers: string
      metadataId: string | null
    }, ExtArgs["result"]["game"]>
    composites: {}
  }

  type GameGetPayload<S extends boolean | null | undefined | GameDefaultArgs> = $Result.GetResult<Prisma.$GamePayload, S>

  type GameCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameCountAggregateInputType | true
    }

  export interface GameDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Game'], meta: { name: 'Game' } }
    /**
     * Find zero or one Game that matches the filter.
     * @param {GameFindUniqueArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameFindUniqueArgs>(args: SelectSubset<T, GameFindUniqueArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Game that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameFindUniqueOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameFindUniqueOrThrowArgs>(args: SelectSubset<T, GameFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Game that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameFindFirstArgs>(args?: SelectSubset<T, GameFindFirstArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Game that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameFindFirstOrThrowArgs>(args?: SelectSubset<T, GameFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Games that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Games
     * const games = await prisma.game.findMany()
     * 
     * // Get first 10 Games
     * const games = await prisma.game.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameWithIdOnly = await prisma.game.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameFindManyArgs>(args?: SelectSubset<T, GameFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Game.
     * @param {GameCreateArgs} args - Arguments to create a Game.
     * @example
     * // Create one Game
     * const Game = await prisma.game.create({
     *   data: {
     *     // ... data to create a Game
     *   }
     * })
     * 
     */
    create<T extends GameCreateArgs>(args: SelectSubset<T, GameCreateArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Games.
     * @param {GameCreateManyArgs} args - Arguments to create many Games.
     * @example
     * // Create many Games
     * const game = await prisma.game.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameCreateManyArgs>(args?: SelectSubset<T, GameCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Games and returns the data saved in the database.
     * @param {GameCreateManyAndReturnArgs} args - Arguments to create many Games.
     * @example
     * // Create many Games
     * const game = await prisma.game.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Games and only return the `id`
     * const gameWithIdOnly = await prisma.game.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameCreateManyAndReturnArgs>(args?: SelectSubset<T, GameCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Game.
     * @param {GameDeleteArgs} args - Arguments to delete one Game.
     * @example
     * // Delete one Game
     * const Game = await prisma.game.delete({
     *   where: {
     *     // ... filter to delete one Game
     *   }
     * })
     * 
     */
    delete<T extends GameDeleteArgs>(args: SelectSubset<T, GameDeleteArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Game.
     * @param {GameUpdateArgs} args - Arguments to update one Game.
     * @example
     * // Update one Game
     * const game = await prisma.game.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameUpdateArgs>(args: SelectSubset<T, GameUpdateArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Games.
     * @param {GameDeleteManyArgs} args - Arguments to filter Games to delete.
     * @example
     * // Delete a few Games
     * const { count } = await prisma.game.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameDeleteManyArgs>(args?: SelectSubset<T, GameDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Games
     * const game = await prisma.game.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameUpdateManyArgs>(args: SelectSubset<T, GameUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Games and returns the data updated in the database.
     * @param {GameUpdateManyAndReturnArgs} args - Arguments to update many Games.
     * @example
     * // Update many Games
     * const game = await prisma.game.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Games and only return the `id`
     * const gameWithIdOnly = await prisma.game.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameUpdateManyAndReturnArgs>(args: SelectSubset<T, GameUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Game.
     * @param {GameUpsertArgs} args - Arguments to update or create a Game.
     * @example
     * // Update or create a Game
     * const game = await prisma.game.upsert({
     *   create: {
     *     // ... data to create a Game
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Game we want to update
     *   }
     * })
     */
    upsert<T extends GameUpsertArgs>(args: SelectSubset<T, GameUpsertArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameCountArgs} args - Arguments to filter Games to count.
     * @example
     * // Count the number of Games
     * const count = await prisma.game.count({
     *   where: {
     *     // ... the filter for the Games we want to count
     *   }
     * })
    **/
    count<T extends GameCountArgs>(
      args?: Subset<T, GameCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameAggregateArgs>(args: Subset<T, GameAggregateArgs>): Prisma.PrismaPromise<GetGameAggregateType<T>>

    /**
     * Group by Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameGroupByArgs['orderBy'] }
        : { orderBy?: GameGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Game model
   */
  readonly fields: GameFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Game.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    players<T extends Game$playersArgs<ExtArgs> = {}>(args?: Subset<T, Game$playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    metadata<T extends Game$metadataArgs<ExtArgs> = {}>(args?: Subset<T, Game$metadataArgs<ExtArgs>>): Prisma__MetadataClient<$Result.GetResult<Prisma.$MetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Game model
   */
  interface GameFieldRefs {
    readonly id: FieldRef<"Game", 'Int'>
    readonly game: FieldRef<"Game", 'String'>
    readonly gameId: FieldRef<"Game", 'String'>
    readonly winner: FieldRef<"Game", 'String'>
    readonly score: FieldRef<"Game", 'String'>
    readonly replay: FieldRef<"Game", 'String'>
    readonly gamePlayers: FieldRef<"Game", 'String'>
    readonly metadataId: FieldRef<"Game", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Game findUnique
   */
  export type GameFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game findUniqueOrThrow
   */
  export type GameFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game findFirst
   */
  export type GameFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Games.
     */
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game findFirstOrThrow
   */
  export type GameFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Games.
     */
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game findMany
   */
  export type GameFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Games to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game create
   */
  export type GameCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The data needed to create a Game.
     */
    data: XOR<GameCreateInput, GameUncheckedCreateInput>
  }

  /**
   * Game createMany
   */
  export type GameCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Games.
     */
    data: GameCreateManyInput | GameCreateManyInput[]
  }

  /**
   * Game createManyAndReturn
   */
  export type GameCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * The data used to create many Games.
     */
    data: GameCreateManyInput | GameCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Game update
   */
  export type GameUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The data needed to update a Game.
     */
    data: XOR<GameUpdateInput, GameUncheckedUpdateInput>
    /**
     * Choose, which Game to update.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game updateMany
   */
  export type GameUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Games.
     */
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>
    /**
     * Filter which Games to update
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to update.
     */
    limit?: number
  }

  /**
   * Game updateManyAndReturn
   */
  export type GameUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * The data used to update Games.
     */
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>
    /**
     * Filter which Games to update
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Game upsert
   */
  export type GameUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The filter to search for the Game to update in case it exists.
     */
    where: GameWhereUniqueInput
    /**
     * In case the Game found by the `where` argument doesn't exist, create a new Game with this data.
     */
    create: XOR<GameCreateInput, GameUncheckedCreateInput>
    /**
     * In case the Game was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameUpdateInput, GameUncheckedUpdateInput>
  }

  /**
   * Game delete
   */
  export type GameDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter which Game to delete.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game deleteMany
   */
  export type GameDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Games to delete
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to delete.
     */
    limit?: number
  }

  /**
   * Game.players
   */
  export type Game$playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Game.metadata
   */
  export type Game$metadataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Metadata
     */
    select?: MetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Metadata
     */
    omit?: MetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetadataInclude<ExtArgs> | null
    where?: MetadataWhereInput
  }

  /**
   * Game without action
   */
  export type GameDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    linkId: number | null
    wins: number | null
    losses: number | null
    tournamentWins: number | null
    tournamentLosses: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    linkId: number | null
    wins: number | null
    losses: number | null
    tournamentWins: number | null
    tournamentLosses: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    linkId: number | null
    username: string | null
    avatarUrl: string | null
    wins: number | null
    losses: number | null
    tournamentWins: number | null
    tournamentLosses: number | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    linkId: number | null
    username: string | null
    avatarUrl: string | null
    wins: number | null
    losses: number | null
    tournamentWins: number | null
    tournamentLosses: number | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    linkId: number
    username: number
    avatarUrl: number
    wins: number
    losses: number
    tournamentWins: number
    tournamentLosses: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    linkId?: true
    wins?: true
    losses?: true
    tournamentWins?: true
    tournamentLosses?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    linkId?: true
    wins?: true
    losses?: true
    tournamentWins?: true
    tournamentLosses?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    linkId?: true
    username?: true
    avatarUrl?: true
    wins?: true
    losses?: true
    tournamentWins?: true
    tournamentLosses?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    linkId?: true
    username?: true
    avatarUrl?: true
    wins?: true
    losses?: true
    tournamentWins?: true
    tournamentLosses?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    linkId?: true
    username?: true
    avatarUrl?: true
    wins?: true
    losses?: true
    tournamentWins?: true
    tournamentLosses?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    linkId: number
    username: string | null
    avatarUrl: string | null
    wins: number
    losses: number
    tournamentWins: number
    tournamentLosses: number
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    linkId?: boolean
    username?: boolean
    avatarUrl?: boolean
    wins?: boolean
    losses?: boolean
    tournamentWins?: boolean
    tournamentLosses?: boolean
    friends?: boolean | User$friendsArgs<ExtArgs>
    friendOf?: boolean | User$friendOfArgs<ExtArgs>
    incomingRequests?: boolean | User$incomingRequestsArgs<ExtArgs>
    outgoingRequests?: boolean | User$outgoingRequestsArgs<ExtArgs>
    history?: boolean | User$historyArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    linkId?: boolean
    username?: boolean
    avatarUrl?: boolean
    wins?: boolean
    losses?: boolean
    tournamentWins?: boolean
    tournamentLosses?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    linkId?: boolean
    username?: boolean
    avatarUrl?: boolean
    wins?: boolean
    losses?: boolean
    tournamentWins?: boolean
    tournamentLosses?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    linkId?: boolean
    username?: boolean
    avatarUrl?: boolean
    wins?: boolean
    losses?: boolean
    tournamentWins?: boolean
    tournamentLosses?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "linkId" | "username" | "avatarUrl" | "wins" | "losses" | "tournamentWins" | "tournamentLosses", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    friends?: boolean | User$friendsArgs<ExtArgs>
    friendOf?: boolean | User$friendOfArgs<ExtArgs>
    incomingRequests?: boolean | User$incomingRequestsArgs<ExtArgs>
    outgoingRequests?: boolean | User$outgoingRequestsArgs<ExtArgs>
    history?: boolean | User$historyArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      friends: Prisma.$UserPayload<ExtArgs>[]
      friendOf: Prisma.$UserPayload<ExtArgs>[]
      incomingRequests: Prisma.$UserPayload<ExtArgs>[]
      outgoingRequests: Prisma.$UserPayload<ExtArgs>[]
      history: Prisma.$GamePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      linkId: number
      username: string | null
      avatarUrl: string | null
      wins: number
      losses: number
      tournamentWins: number
      tournamentLosses: number
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    friends<T extends User$friendsArgs<ExtArgs> = {}>(args?: Subset<T, User$friendsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    friendOf<T extends User$friendOfArgs<ExtArgs> = {}>(args?: Subset<T, User$friendOfArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    incomingRequests<T extends User$incomingRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$incomingRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    outgoingRequests<T extends User$outgoingRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$outgoingRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    history<T extends User$historyArgs<ExtArgs> = {}>(args?: Subset<T, User$historyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly linkId: FieldRef<"User", 'Int'>
    readonly username: FieldRef<"User", 'String'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly wins: FieldRef<"User", 'Int'>
    readonly losses: FieldRef<"User", 'Int'>
    readonly tournamentWins: FieldRef<"User", 'Int'>
    readonly tournamentLosses: FieldRef<"User", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.friends
   */
  export type User$friendsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User.friendOf
   */
  export type User$friendOfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User.incomingRequests
   */
  export type User$incomingRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User.outgoingRequests
   */
  export type User$outgoingRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User.history
   */
  export type User$historyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    where?: GameWhereInput
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    cursor?: GameWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const MetadataScalarFieldEnum: {
    id: 'id',
    origin: 'origin',
    originId: 'originId',
    room: 'room'
  };

  export type MetadataScalarFieldEnum = (typeof MetadataScalarFieldEnum)[keyof typeof MetadataScalarFieldEnum]


  export const GameScalarFieldEnum: {
    id: 'id',
    game: 'game',
    gameId: 'gameId',
    winner: 'winner',
    score: 'score',
    replay: 'replay',
    gamePlayers: 'gamePlayers',
    metadataId: 'metadataId'
  };

  export type GameScalarFieldEnum = (typeof GameScalarFieldEnum)[keyof typeof GameScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    linkId: 'linkId',
    username: 'username',
    avatarUrl: 'avatarUrl',
    wins: 'wins',
    losses: 'losses',
    tournamentWins: 'tournamentWins',
    tournamentLosses: 'tournamentLosses'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type MetadataWhereInput = {
    AND?: MetadataWhereInput | MetadataWhereInput[]
    OR?: MetadataWhereInput[]
    NOT?: MetadataWhereInput | MetadataWhereInput[]
    id?: StringFilter<"Metadata"> | string
    origin?: StringFilter<"Metadata"> | string
    originId?: StringFilter<"Metadata"> | string
    room?: StringNullableFilter<"Metadata"> | string | null
    game?: XOR<GameNullableScalarRelationFilter, GameWhereInput> | null
  }

  export type MetadataOrderByWithRelationInput = {
    id?: SortOrder
    origin?: SortOrder
    originId?: SortOrder
    room?: SortOrderInput | SortOrder
    game?: GameOrderByWithRelationInput
  }

  export type MetadataWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MetadataWhereInput | MetadataWhereInput[]
    OR?: MetadataWhereInput[]
    NOT?: MetadataWhereInput | MetadataWhereInput[]
    origin?: StringFilter<"Metadata"> | string
    originId?: StringFilter<"Metadata"> | string
    room?: StringNullableFilter<"Metadata"> | string | null
    game?: XOR<GameNullableScalarRelationFilter, GameWhereInput> | null
  }, "id">

  export type MetadataOrderByWithAggregationInput = {
    id?: SortOrder
    origin?: SortOrder
    originId?: SortOrder
    room?: SortOrderInput | SortOrder
    _count?: MetadataCountOrderByAggregateInput
    _max?: MetadataMaxOrderByAggregateInput
    _min?: MetadataMinOrderByAggregateInput
  }

  export type MetadataScalarWhereWithAggregatesInput = {
    AND?: MetadataScalarWhereWithAggregatesInput | MetadataScalarWhereWithAggregatesInput[]
    OR?: MetadataScalarWhereWithAggregatesInput[]
    NOT?: MetadataScalarWhereWithAggregatesInput | MetadataScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Metadata"> | string
    origin?: StringWithAggregatesFilter<"Metadata"> | string
    originId?: StringWithAggregatesFilter<"Metadata"> | string
    room?: StringNullableWithAggregatesFilter<"Metadata"> | string | null
  }

  export type GameWhereInput = {
    AND?: GameWhereInput | GameWhereInput[]
    OR?: GameWhereInput[]
    NOT?: GameWhereInput | GameWhereInput[]
    id?: IntFilter<"Game"> | number
    game?: StringFilter<"Game"> | string
    gameId?: StringFilter<"Game"> | string
    winner?: StringFilter<"Game"> | string
    score?: StringFilter<"Game"> | string
    replay?: StringFilter<"Game"> | string
    gamePlayers?: StringFilter<"Game"> | string
    metadataId?: StringNullableFilter<"Game"> | string | null
    players?: UserListRelationFilter
    metadata?: XOR<MetadataNullableScalarRelationFilter, MetadataWhereInput> | null
  }

  export type GameOrderByWithRelationInput = {
    id?: SortOrder
    game?: SortOrder
    gameId?: SortOrder
    winner?: SortOrder
    score?: SortOrder
    replay?: SortOrder
    gamePlayers?: SortOrder
    metadataId?: SortOrderInput | SortOrder
    players?: UserOrderByRelationAggregateInput
    metadata?: MetadataOrderByWithRelationInput
  }

  export type GameWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    metadataId?: string
    AND?: GameWhereInput | GameWhereInput[]
    OR?: GameWhereInput[]
    NOT?: GameWhereInput | GameWhereInput[]
    game?: StringFilter<"Game"> | string
    gameId?: StringFilter<"Game"> | string
    winner?: StringFilter<"Game"> | string
    score?: StringFilter<"Game"> | string
    replay?: StringFilter<"Game"> | string
    gamePlayers?: StringFilter<"Game"> | string
    players?: UserListRelationFilter
    metadata?: XOR<MetadataNullableScalarRelationFilter, MetadataWhereInput> | null
  }, "id" | "metadataId">

  export type GameOrderByWithAggregationInput = {
    id?: SortOrder
    game?: SortOrder
    gameId?: SortOrder
    winner?: SortOrder
    score?: SortOrder
    replay?: SortOrder
    gamePlayers?: SortOrder
    metadataId?: SortOrderInput | SortOrder
    _count?: GameCountOrderByAggregateInput
    _avg?: GameAvgOrderByAggregateInput
    _max?: GameMaxOrderByAggregateInput
    _min?: GameMinOrderByAggregateInput
    _sum?: GameSumOrderByAggregateInput
  }

  export type GameScalarWhereWithAggregatesInput = {
    AND?: GameScalarWhereWithAggregatesInput | GameScalarWhereWithAggregatesInput[]
    OR?: GameScalarWhereWithAggregatesInput[]
    NOT?: GameScalarWhereWithAggregatesInput | GameScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Game"> | number
    game?: StringWithAggregatesFilter<"Game"> | string
    gameId?: StringWithAggregatesFilter<"Game"> | string
    winner?: StringWithAggregatesFilter<"Game"> | string
    score?: StringWithAggregatesFilter<"Game"> | string
    replay?: StringWithAggregatesFilter<"Game"> | string
    gamePlayers?: StringWithAggregatesFilter<"Game"> | string
    metadataId?: StringNullableWithAggregatesFilter<"Game"> | string | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    linkId?: IntFilter<"User"> | number
    username?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    wins?: IntFilter<"User"> | number
    losses?: IntFilter<"User"> | number
    tournamentWins?: IntFilter<"User"> | number
    tournamentLosses?: IntFilter<"User"> | number
    friends?: UserListRelationFilter
    friendOf?: UserListRelationFilter
    incomingRequests?: UserListRelationFilter
    outgoingRequests?: UserListRelationFilter
    history?: GameListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    linkId?: SortOrder
    username?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    wins?: SortOrder
    losses?: SortOrder
    tournamentWins?: SortOrder
    tournamentLosses?: SortOrder
    friends?: UserOrderByRelationAggregateInput
    friendOf?: UserOrderByRelationAggregateInput
    incomingRequests?: UserOrderByRelationAggregateInput
    outgoingRequests?: UserOrderByRelationAggregateInput
    history?: GameOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    linkId?: number
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    username?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    wins?: IntFilter<"User"> | number
    losses?: IntFilter<"User"> | number
    tournamentWins?: IntFilter<"User"> | number
    tournamentLosses?: IntFilter<"User"> | number
    friends?: UserListRelationFilter
    friendOf?: UserListRelationFilter
    incomingRequests?: UserListRelationFilter
    outgoingRequests?: UserListRelationFilter
    history?: GameListRelationFilter
  }, "id" | "linkId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    linkId?: SortOrder
    username?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    wins?: SortOrder
    losses?: SortOrder
    tournamentWins?: SortOrder
    tournamentLosses?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    linkId?: IntWithAggregatesFilter<"User"> | number
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    wins?: IntWithAggregatesFilter<"User"> | number
    losses?: IntWithAggregatesFilter<"User"> | number
    tournamentWins?: IntWithAggregatesFilter<"User"> | number
    tournamentLosses?: IntWithAggregatesFilter<"User"> | number
  }

  export type MetadataCreateInput = {
    id?: string
    origin: string
    originId: string
    room?: string | null
    game?: GameCreateNestedOneWithoutMetadataInput
  }

  export type MetadataUncheckedCreateInput = {
    id?: string
    origin: string
    originId: string
    room?: string | null
    game?: GameUncheckedCreateNestedOneWithoutMetadataInput
  }

  export type MetadataUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    originId?: StringFieldUpdateOperationsInput | string
    room?: NullableStringFieldUpdateOperationsInput | string | null
    game?: GameUpdateOneWithoutMetadataNestedInput
  }

  export type MetadataUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    originId?: StringFieldUpdateOperationsInput | string
    room?: NullableStringFieldUpdateOperationsInput | string | null
    game?: GameUncheckedUpdateOneWithoutMetadataNestedInput
  }

  export type MetadataCreateManyInput = {
    id?: string
    origin: string
    originId: string
    room?: string | null
  }

  export type MetadataUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    originId?: StringFieldUpdateOperationsInput | string
    room?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MetadataUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    originId?: StringFieldUpdateOperationsInput | string
    room?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameCreateInput = {
    game: string
    gameId: string
    winner: string
    score: string
    replay: string
    gamePlayers: string
    players?: UserCreateNestedManyWithoutHistoryInput
    metadata?: MetadataCreateNestedOneWithoutGameInput
  }

  export type GameUncheckedCreateInput = {
    id?: number
    game: string
    gameId: string
    winner: string
    score: string
    replay: string
    gamePlayers: string
    metadataId?: string | null
    players?: UserUncheckedCreateNestedManyWithoutHistoryInput
  }

  export type GameUpdateInput = {
    game?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    score?: StringFieldUpdateOperationsInput | string
    replay?: StringFieldUpdateOperationsInput | string
    gamePlayers?: StringFieldUpdateOperationsInput | string
    players?: UserUpdateManyWithoutHistoryNestedInput
    metadata?: MetadataUpdateOneWithoutGameNestedInput
  }

  export type GameUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    game?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    score?: StringFieldUpdateOperationsInput | string
    replay?: StringFieldUpdateOperationsInput | string
    gamePlayers?: StringFieldUpdateOperationsInput | string
    metadataId?: NullableStringFieldUpdateOperationsInput | string | null
    players?: UserUncheckedUpdateManyWithoutHistoryNestedInput
  }

  export type GameCreateManyInput = {
    id?: number
    game: string
    gameId: string
    winner: string
    score: string
    replay: string
    gamePlayers: string
    metadataId?: string | null
  }

  export type GameUpdateManyMutationInput = {
    game?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    score?: StringFieldUpdateOperationsInput | string
    replay?: StringFieldUpdateOperationsInput | string
    gamePlayers?: StringFieldUpdateOperationsInput | string
  }

  export type GameUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    game?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    score?: StringFieldUpdateOperationsInput | string
    replay?: StringFieldUpdateOperationsInput | string
    gamePlayers?: StringFieldUpdateOperationsInput | string
    metadataId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateInput = {
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friends?: UserCreateNestedManyWithoutFriendOfInput
    friendOf?: UserCreateNestedManyWithoutFriendsInput
    incomingRequests?: UserCreateNestedManyWithoutOutgoingRequestsInput
    outgoingRequests?: UserCreateNestedManyWithoutIncomingRequestsInput
    history?: GameCreateNestedManyWithoutPlayersInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friends?: UserUncheckedCreateNestedManyWithoutFriendOfInput
    friendOf?: UserUncheckedCreateNestedManyWithoutFriendsInput
    incomingRequests?: UserUncheckedCreateNestedManyWithoutOutgoingRequestsInput
    outgoingRequests?: UserUncheckedCreateNestedManyWithoutIncomingRequestsInput
    history?: GameUncheckedCreateNestedManyWithoutPlayersInput
  }

  export type UserUpdateInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friends?: UserUpdateManyWithoutFriendOfNestedInput
    friendOf?: UserUpdateManyWithoutFriendsNestedInput
    incomingRequests?: UserUpdateManyWithoutOutgoingRequestsNestedInput
    outgoingRequests?: UserUpdateManyWithoutIncomingRequestsNestedInput
    history?: GameUpdateManyWithoutPlayersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friends?: UserUncheckedUpdateManyWithoutFriendOfNestedInput
    friendOf?: UserUncheckedUpdateManyWithoutFriendsNestedInput
    incomingRequests?: UserUncheckedUpdateManyWithoutOutgoingRequestsNestedInput
    outgoingRequests?: UserUncheckedUpdateManyWithoutIncomingRequestsNestedInput
    history?: GameUncheckedUpdateManyWithoutPlayersNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
  }

  export type UserUpdateManyMutationInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type GameNullableScalarRelationFilter = {
    is?: GameWhereInput | null
    isNot?: GameWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MetadataCountOrderByAggregateInput = {
    id?: SortOrder
    origin?: SortOrder
    originId?: SortOrder
    room?: SortOrder
  }

  export type MetadataMaxOrderByAggregateInput = {
    id?: SortOrder
    origin?: SortOrder
    originId?: SortOrder
    room?: SortOrder
  }

  export type MetadataMinOrderByAggregateInput = {
    id?: SortOrder
    origin?: SortOrder
    originId?: SortOrder
    room?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type MetadataNullableScalarRelationFilter = {
    is?: MetadataWhereInput | null
    isNot?: MetadataWhereInput | null
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameCountOrderByAggregateInput = {
    id?: SortOrder
    game?: SortOrder
    gameId?: SortOrder
    winner?: SortOrder
    score?: SortOrder
    replay?: SortOrder
    gamePlayers?: SortOrder
    metadataId?: SortOrder
  }

  export type GameAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type GameMaxOrderByAggregateInput = {
    id?: SortOrder
    game?: SortOrder
    gameId?: SortOrder
    winner?: SortOrder
    score?: SortOrder
    replay?: SortOrder
    gamePlayers?: SortOrder
    metadataId?: SortOrder
  }

  export type GameMinOrderByAggregateInput = {
    id?: SortOrder
    game?: SortOrder
    gameId?: SortOrder
    winner?: SortOrder
    score?: SortOrder
    replay?: SortOrder
    gamePlayers?: SortOrder
    metadataId?: SortOrder
  }

  export type GameSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type GameListRelationFilter = {
    every?: GameWhereInput
    some?: GameWhereInput
    none?: GameWhereInput
  }

  export type GameOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    linkId?: SortOrder
    username?: SortOrder
    avatarUrl?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    tournamentWins?: SortOrder
    tournamentLosses?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    linkId?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    tournamentWins?: SortOrder
    tournamentLosses?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    linkId?: SortOrder
    username?: SortOrder
    avatarUrl?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    tournamentWins?: SortOrder
    tournamentLosses?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    linkId?: SortOrder
    username?: SortOrder
    avatarUrl?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    tournamentWins?: SortOrder
    tournamentLosses?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    linkId?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    tournamentWins?: SortOrder
    tournamentLosses?: SortOrder
  }

  export type GameCreateNestedOneWithoutMetadataInput = {
    create?: XOR<GameCreateWithoutMetadataInput, GameUncheckedCreateWithoutMetadataInput>
    connectOrCreate?: GameCreateOrConnectWithoutMetadataInput
    connect?: GameWhereUniqueInput
  }

  export type GameUncheckedCreateNestedOneWithoutMetadataInput = {
    create?: XOR<GameCreateWithoutMetadataInput, GameUncheckedCreateWithoutMetadataInput>
    connectOrCreate?: GameCreateOrConnectWithoutMetadataInput
    connect?: GameWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type GameUpdateOneWithoutMetadataNestedInput = {
    create?: XOR<GameCreateWithoutMetadataInput, GameUncheckedCreateWithoutMetadataInput>
    connectOrCreate?: GameCreateOrConnectWithoutMetadataInput
    upsert?: GameUpsertWithoutMetadataInput
    disconnect?: GameWhereInput | boolean
    delete?: GameWhereInput | boolean
    connect?: GameWhereUniqueInput
    update?: XOR<XOR<GameUpdateToOneWithWhereWithoutMetadataInput, GameUpdateWithoutMetadataInput>, GameUncheckedUpdateWithoutMetadataInput>
  }

  export type GameUncheckedUpdateOneWithoutMetadataNestedInput = {
    create?: XOR<GameCreateWithoutMetadataInput, GameUncheckedCreateWithoutMetadataInput>
    connectOrCreate?: GameCreateOrConnectWithoutMetadataInput
    upsert?: GameUpsertWithoutMetadataInput
    disconnect?: GameWhereInput | boolean
    delete?: GameWhereInput | boolean
    connect?: GameWhereUniqueInput
    update?: XOR<XOR<GameUpdateToOneWithWhereWithoutMetadataInput, GameUpdateWithoutMetadataInput>, GameUncheckedUpdateWithoutMetadataInput>
  }

  export type UserCreateNestedManyWithoutHistoryInput = {
    create?: XOR<UserCreateWithoutHistoryInput, UserUncheckedCreateWithoutHistoryInput> | UserCreateWithoutHistoryInput[] | UserUncheckedCreateWithoutHistoryInput[]
    connectOrCreate?: UserCreateOrConnectWithoutHistoryInput | UserCreateOrConnectWithoutHistoryInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type MetadataCreateNestedOneWithoutGameInput = {
    create?: XOR<MetadataCreateWithoutGameInput, MetadataUncheckedCreateWithoutGameInput>
    connectOrCreate?: MetadataCreateOrConnectWithoutGameInput
    connect?: MetadataWhereUniqueInput
  }

  export type UserUncheckedCreateNestedManyWithoutHistoryInput = {
    create?: XOR<UserCreateWithoutHistoryInput, UserUncheckedCreateWithoutHistoryInput> | UserCreateWithoutHistoryInput[] | UserUncheckedCreateWithoutHistoryInput[]
    connectOrCreate?: UserCreateOrConnectWithoutHistoryInput | UserCreateOrConnectWithoutHistoryInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutHistoryNestedInput = {
    create?: XOR<UserCreateWithoutHistoryInput, UserUncheckedCreateWithoutHistoryInput> | UserCreateWithoutHistoryInput[] | UserUncheckedCreateWithoutHistoryInput[]
    connectOrCreate?: UserCreateOrConnectWithoutHistoryInput | UserCreateOrConnectWithoutHistoryInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutHistoryInput | UserUpsertWithWhereUniqueWithoutHistoryInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutHistoryInput | UserUpdateWithWhereUniqueWithoutHistoryInput[]
    updateMany?: UserUpdateManyWithWhereWithoutHistoryInput | UserUpdateManyWithWhereWithoutHistoryInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type MetadataUpdateOneWithoutGameNestedInput = {
    create?: XOR<MetadataCreateWithoutGameInput, MetadataUncheckedCreateWithoutGameInput>
    connectOrCreate?: MetadataCreateOrConnectWithoutGameInput
    upsert?: MetadataUpsertWithoutGameInput
    disconnect?: MetadataWhereInput | boolean
    delete?: MetadataWhereInput | boolean
    connect?: MetadataWhereUniqueInput
    update?: XOR<XOR<MetadataUpdateToOneWithWhereWithoutGameInput, MetadataUpdateWithoutGameInput>, MetadataUncheckedUpdateWithoutGameInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUncheckedUpdateManyWithoutHistoryNestedInput = {
    create?: XOR<UserCreateWithoutHistoryInput, UserUncheckedCreateWithoutHistoryInput> | UserCreateWithoutHistoryInput[] | UserUncheckedCreateWithoutHistoryInput[]
    connectOrCreate?: UserCreateOrConnectWithoutHistoryInput | UserCreateOrConnectWithoutHistoryInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutHistoryInput | UserUpsertWithWhereUniqueWithoutHistoryInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutHistoryInput | UserUpdateWithWhereUniqueWithoutHistoryInput[]
    updateMany?: UserUpdateManyWithWhereWithoutHistoryInput | UserUpdateManyWithWhereWithoutHistoryInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutFriendOfInput = {
    create?: XOR<UserCreateWithoutFriendOfInput, UserUncheckedCreateWithoutFriendOfInput> | UserCreateWithoutFriendOfInput[] | UserUncheckedCreateWithoutFriendOfInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFriendOfInput | UserCreateOrConnectWithoutFriendOfInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutFriendsInput = {
    create?: XOR<UserCreateWithoutFriendsInput, UserUncheckedCreateWithoutFriendsInput> | UserCreateWithoutFriendsInput[] | UserUncheckedCreateWithoutFriendsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFriendsInput | UserCreateOrConnectWithoutFriendsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutOutgoingRequestsInput = {
    create?: XOR<UserCreateWithoutOutgoingRequestsInput, UserUncheckedCreateWithoutOutgoingRequestsInput> | UserCreateWithoutOutgoingRequestsInput[] | UserUncheckedCreateWithoutOutgoingRequestsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOutgoingRequestsInput | UserCreateOrConnectWithoutOutgoingRequestsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutIncomingRequestsInput = {
    create?: XOR<UserCreateWithoutIncomingRequestsInput, UserUncheckedCreateWithoutIncomingRequestsInput> | UserCreateWithoutIncomingRequestsInput[] | UserUncheckedCreateWithoutIncomingRequestsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutIncomingRequestsInput | UserCreateOrConnectWithoutIncomingRequestsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type GameCreateNestedManyWithoutPlayersInput = {
    create?: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput> | GameCreateWithoutPlayersInput[] | GameUncheckedCreateWithoutPlayersInput[]
    connectOrCreate?: GameCreateOrConnectWithoutPlayersInput | GameCreateOrConnectWithoutPlayersInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutFriendOfInput = {
    create?: XOR<UserCreateWithoutFriendOfInput, UserUncheckedCreateWithoutFriendOfInput> | UserCreateWithoutFriendOfInput[] | UserUncheckedCreateWithoutFriendOfInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFriendOfInput | UserCreateOrConnectWithoutFriendOfInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutFriendsInput = {
    create?: XOR<UserCreateWithoutFriendsInput, UserUncheckedCreateWithoutFriendsInput> | UserCreateWithoutFriendsInput[] | UserUncheckedCreateWithoutFriendsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFriendsInput | UserCreateOrConnectWithoutFriendsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutOutgoingRequestsInput = {
    create?: XOR<UserCreateWithoutOutgoingRequestsInput, UserUncheckedCreateWithoutOutgoingRequestsInput> | UserCreateWithoutOutgoingRequestsInput[] | UserUncheckedCreateWithoutOutgoingRequestsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOutgoingRequestsInput | UserCreateOrConnectWithoutOutgoingRequestsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutIncomingRequestsInput = {
    create?: XOR<UserCreateWithoutIncomingRequestsInput, UserUncheckedCreateWithoutIncomingRequestsInput> | UserCreateWithoutIncomingRequestsInput[] | UserUncheckedCreateWithoutIncomingRequestsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutIncomingRequestsInput | UserCreateOrConnectWithoutIncomingRequestsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type GameUncheckedCreateNestedManyWithoutPlayersInput = {
    create?: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput> | GameCreateWithoutPlayersInput[] | GameUncheckedCreateWithoutPlayersInput[]
    connectOrCreate?: GameCreateOrConnectWithoutPlayersInput | GameCreateOrConnectWithoutPlayersInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutFriendOfNestedInput = {
    create?: XOR<UserCreateWithoutFriendOfInput, UserUncheckedCreateWithoutFriendOfInput> | UserCreateWithoutFriendOfInput[] | UserUncheckedCreateWithoutFriendOfInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFriendOfInput | UserCreateOrConnectWithoutFriendOfInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutFriendOfInput | UserUpsertWithWhereUniqueWithoutFriendOfInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutFriendOfInput | UserUpdateWithWhereUniqueWithoutFriendOfInput[]
    updateMany?: UserUpdateManyWithWhereWithoutFriendOfInput | UserUpdateManyWithWhereWithoutFriendOfInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUpdateManyWithoutFriendsNestedInput = {
    create?: XOR<UserCreateWithoutFriendsInput, UserUncheckedCreateWithoutFriendsInput> | UserCreateWithoutFriendsInput[] | UserUncheckedCreateWithoutFriendsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFriendsInput | UserCreateOrConnectWithoutFriendsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutFriendsInput | UserUpsertWithWhereUniqueWithoutFriendsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutFriendsInput | UserUpdateWithWhereUniqueWithoutFriendsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutFriendsInput | UserUpdateManyWithWhereWithoutFriendsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUpdateManyWithoutOutgoingRequestsNestedInput = {
    create?: XOR<UserCreateWithoutOutgoingRequestsInput, UserUncheckedCreateWithoutOutgoingRequestsInput> | UserCreateWithoutOutgoingRequestsInput[] | UserUncheckedCreateWithoutOutgoingRequestsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOutgoingRequestsInput | UserCreateOrConnectWithoutOutgoingRequestsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOutgoingRequestsInput | UserUpsertWithWhereUniqueWithoutOutgoingRequestsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOutgoingRequestsInput | UserUpdateWithWhereUniqueWithoutOutgoingRequestsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOutgoingRequestsInput | UserUpdateManyWithWhereWithoutOutgoingRequestsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUpdateManyWithoutIncomingRequestsNestedInput = {
    create?: XOR<UserCreateWithoutIncomingRequestsInput, UserUncheckedCreateWithoutIncomingRequestsInput> | UserCreateWithoutIncomingRequestsInput[] | UserUncheckedCreateWithoutIncomingRequestsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutIncomingRequestsInput | UserCreateOrConnectWithoutIncomingRequestsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutIncomingRequestsInput | UserUpsertWithWhereUniqueWithoutIncomingRequestsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutIncomingRequestsInput | UserUpdateWithWhereUniqueWithoutIncomingRequestsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutIncomingRequestsInput | UserUpdateManyWithWhereWithoutIncomingRequestsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type GameUpdateManyWithoutPlayersNestedInput = {
    create?: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput> | GameCreateWithoutPlayersInput[] | GameUncheckedCreateWithoutPlayersInput[]
    connectOrCreate?: GameCreateOrConnectWithoutPlayersInput | GameCreateOrConnectWithoutPlayersInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutPlayersInput | GameUpsertWithWhereUniqueWithoutPlayersInput[]
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutPlayersInput | GameUpdateWithWhereUniqueWithoutPlayersInput[]
    updateMany?: GameUpdateManyWithWhereWithoutPlayersInput | GameUpdateManyWithWhereWithoutPlayersInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutFriendOfNestedInput = {
    create?: XOR<UserCreateWithoutFriendOfInput, UserUncheckedCreateWithoutFriendOfInput> | UserCreateWithoutFriendOfInput[] | UserUncheckedCreateWithoutFriendOfInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFriendOfInput | UserCreateOrConnectWithoutFriendOfInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutFriendOfInput | UserUpsertWithWhereUniqueWithoutFriendOfInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutFriendOfInput | UserUpdateWithWhereUniqueWithoutFriendOfInput[]
    updateMany?: UserUpdateManyWithWhereWithoutFriendOfInput | UserUpdateManyWithWhereWithoutFriendOfInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutFriendsNestedInput = {
    create?: XOR<UserCreateWithoutFriendsInput, UserUncheckedCreateWithoutFriendsInput> | UserCreateWithoutFriendsInput[] | UserUncheckedCreateWithoutFriendsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFriendsInput | UserCreateOrConnectWithoutFriendsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutFriendsInput | UserUpsertWithWhereUniqueWithoutFriendsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutFriendsInput | UserUpdateWithWhereUniqueWithoutFriendsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutFriendsInput | UserUpdateManyWithWhereWithoutFriendsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutOutgoingRequestsNestedInput = {
    create?: XOR<UserCreateWithoutOutgoingRequestsInput, UserUncheckedCreateWithoutOutgoingRequestsInput> | UserCreateWithoutOutgoingRequestsInput[] | UserUncheckedCreateWithoutOutgoingRequestsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOutgoingRequestsInput | UserCreateOrConnectWithoutOutgoingRequestsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOutgoingRequestsInput | UserUpsertWithWhereUniqueWithoutOutgoingRequestsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOutgoingRequestsInput | UserUpdateWithWhereUniqueWithoutOutgoingRequestsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOutgoingRequestsInput | UserUpdateManyWithWhereWithoutOutgoingRequestsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutIncomingRequestsNestedInput = {
    create?: XOR<UserCreateWithoutIncomingRequestsInput, UserUncheckedCreateWithoutIncomingRequestsInput> | UserCreateWithoutIncomingRequestsInput[] | UserUncheckedCreateWithoutIncomingRequestsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutIncomingRequestsInput | UserCreateOrConnectWithoutIncomingRequestsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutIncomingRequestsInput | UserUpsertWithWhereUniqueWithoutIncomingRequestsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutIncomingRequestsInput | UserUpdateWithWhereUniqueWithoutIncomingRequestsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutIncomingRequestsInput | UserUpdateManyWithWhereWithoutIncomingRequestsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type GameUncheckedUpdateManyWithoutPlayersNestedInput = {
    create?: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput> | GameCreateWithoutPlayersInput[] | GameUncheckedCreateWithoutPlayersInput[]
    connectOrCreate?: GameCreateOrConnectWithoutPlayersInput | GameCreateOrConnectWithoutPlayersInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutPlayersInput | GameUpsertWithWhereUniqueWithoutPlayersInput[]
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutPlayersInput | GameUpdateWithWhereUniqueWithoutPlayersInput[]
    updateMany?: GameUpdateManyWithWhereWithoutPlayersInput | GameUpdateManyWithWhereWithoutPlayersInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type GameCreateWithoutMetadataInput = {
    game: string
    gameId: string
    winner: string
    score: string
    replay: string
    gamePlayers: string
    players?: UserCreateNestedManyWithoutHistoryInput
  }

  export type GameUncheckedCreateWithoutMetadataInput = {
    id?: number
    game: string
    gameId: string
    winner: string
    score: string
    replay: string
    gamePlayers: string
    players?: UserUncheckedCreateNestedManyWithoutHistoryInput
  }

  export type GameCreateOrConnectWithoutMetadataInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutMetadataInput, GameUncheckedCreateWithoutMetadataInput>
  }

  export type GameUpsertWithoutMetadataInput = {
    update: XOR<GameUpdateWithoutMetadataInput, GameUncheckedUpdateWithoutMetadataInput>
    create: XOR<GameCreateWithoutMetadataInput, GameUncheckedCreateWithoutMetadataInput>
    where?: GameWhereInput
  }

  export type GameUpdateToOneWithWhereWithoutMetadataInput = {
    where?: GameWhereInput
    data: XOR<GameUpdateWithoutMetadataInput, GameUncheckedUpdateWithoutMetadataInput>
  }

  export type GameUpdateWithoutMetadataInput = {
    game?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    score?: StringFieldUpdateOperationsInput | string
    replay?: StringFieldUpdateOperationsInput | string
    gamePlayers?: StringFieldUpdateOperationsInput | string
    players?: UserUpdateManyWithoutHistoryNestedInput
  }

  export type GameUncheckedUpdateWithoutMetadataInput = {
    id?: IntFieldUpdateOperationsInput | number
    game?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    score?: StringFieldUpdateOperationsInput | string
    replay?: StringFieldUpdateOperationsInput | string
    gamePlayers?: StringFieldUpdateOperationsInput | string
    players?: UserUncheckedUpdateManyWithoutHistoryNestedInput
  }

  export type UserCreateWithoutHistoryInput = {
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friends?: UserCreateNestedManyWithoutFriendOfInput
    friendOf?: UserCreateNestedManyWithoutFriendsInput
    incomingRequests?: UserCreateNestedManyWithoutOutgoingRequestsInput
    outgoingRequests?: UserCreateNestedManyWithoutIncomingRequestsInput
  }

  export type UserUncheckedCreateWithoutHistoryInput = {
    id?: number
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friends?: UserUncheckedCreateNestedManyWithoutFriendOfInput
    friendOf?: UserUncheckedCreateNestedManyWithoutFriendsInput
    incomingRequests?: UserUncheckedCreateNestedManyWithoutOutgoingRequestsInput
    outgoingRequests?: UserUncheckedCreateNestedManyWithoutIncomingRequestsInput
  }

  export type UserCreateOrConnectWithoutHistoryInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutHistoryInput, UserUncheckedCreateWithoutHistoryInput>
  }

  export type MetadataCreateWithoutGameInput = {
    id?: string
    origin: string
    originId: string
    room?: string | null
  }

  export type MetadataUncheckedCreateWithoutGameInput = {
    id?: string
    origin: string
    originId: string
    room?: string | null
  }

  export type MetadataCreateOrConnectWithoutGameInput = {
    where: MetadataWhereUniqueInput
    create: XOR<MetadataCreateWithoutGameInput, MetadataUncheckedCreateWithoutGameInput>
  }

  export type UserUpsertWithWhereUniqueWithoutHistoryInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutHistoryInput, UserUncheckedUpdateWithoutHistoryInput>
    create: XOR<UserCreateWithoutHistoryInput, UserUncheckedCreateWithoutHistoryInput>
  }

  export type UserUpdateWithWhereUniqueWithoutHistoryInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutHistoryInput, UserUncheckedUpdateWithoutHistoryInput>
  }

  export type UserUpdateManyWithWhereWithoutHistoryInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutHistoryInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: IntFilter<"User"> | number
    linkId?: IntFilter<"User"> | number
    username?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    wins?: IntFilter<"User"> | number
    losses?: IntFilter<"User"> | number
    tournamentWins?: IntFilter<"User"> | number
    tournamentLosses?: IntFilter<"User"> | number
  }

  export type MetadataUpsertWithoutGameInput = {
    update: XOR<MetadataUpdateWithoutGameInput, MetadataUncheckedUpdateWithoutGameInput>
    create: XOR<MetadataCreateWithoutGameInput, MetadataUncheckedCreateWithoutGameInput>
    where?: MetadataWhereInput
  }

  export type MetadataUpdateToOneWithWhereWithoutGameInput = {
    where?: MetadataWhereInput
    data: XOR<MetadataUpdateWithoutGameInput, MetadataUncheckedUpdateWithoutGameInput>
  }

  export type MetadataUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    originId?: StringFieldUpdateOperationsInput | string
    room?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MetadataUncheckedUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    originId?: StringFieldUpdateOperationsInput | string
    room?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateWithoutFriendOfInput = {
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friends?: UserCreateNestedManyWithoutFriendOfInput
    incomingRequests?: UserCreateNestedManyWithoutOutgoingRequestsInput
    outgoingRequests?: UserCreateNestedManyWithoutIncomingRequestsInput
    history?: GameCreateNestedManyWithoutPlayersInput
  }

  export type UserUncheckedCreateWithoutFriendOfInput = {
    id?: number
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friends?: UserUncheckedCreateNestedManyWithoutFriendOfInput
    incomingRequests?: UserUncheckedCreateNestedManyWithoutOutgoingRequestsInput
    outgoingRequests?: UserUncheckedCreateNestedManyWithoutIncomingRequestsInput
    history?: GameUncheckedCreateNestedManyWithoutPlayersInput
  }

  export type UserCreateOrConnectWithoutFriendOfInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFriendOfInput, UserUncheckedCreateWithoutFriendOfInput>
  }

  export type UserCreateWithoutFriendsInput = {
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friendOf?: UserCreateNestedManyWithoutFriendsInput
    incomingRequests?: UserCreateNestedManyWithoutOutgoingRequestsInput
    outgoingRequests?: UserCreateNestedManyWithoutIncomingRequestsInput
    history?: GameCreateNestedManyWithoutPlayersInput
  }

  export type UserUncheckedCreateWithoutFriendsInput = {
    id?: number
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friendOf?: UserUncheckedCreateNestedManyWithoutFriendsInput
    incomingRequests?: UserUncheckedCreateNestedManyWithoutOutgoingRequestsInput
    outgoingRequests?: UserUncheckedCreateNestedManyWithoutIncomingRequestsInput
    history?: GameUncheckedCreateNestedManyWithoutPlayersInput
  }

  export type UserCreateOrConnectWithoutFriendsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFriendsInput, UserUncheckedCreateWithoutFriendsInput>
  }

  export type UserCreateWithoutOutgoingRequestsInput = {
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friends?: UserCreateNestedManyWithoutFriendOfInput
    friendOf?: UserCreateNestedManyWithoutFriendsInput
    incomingRequests?: UserCreateNestedManyWithoutOutgoingRequestsInput
    history?: GameCreateNestedManyWithoutPlayersInput
  }

  export type UserUncheckedCreateWithoutOutgoingRequestsInput = {
    id?: number
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friends?: UserUncheckedCreateNestedManyWithoutFriendOfInput
    friendOf?: UserUncheckedCreateNestedManyWithoutFriendsInput
    incomingRequests?: UserUncheckedCreateNestedManyWithoutOutgoingRequestsInput
    history?: GameUncheckedCreateNestedManyWithoutPlayersInput
  }

  export type UserCreateOrConnectWithoutOutgoingRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOutgoingRequestsInput, UserUncheckedCreateWithoutOutgoingRequestsInput>
  }

  export type UserCreateWithoutIncomingRequestsInput = {
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friends?: UserCreateNestedManyWithoutFriendOfInput
    friendOf?: UserCreateNestedManyWithoutFriendsInput
    outgoingRequests?: UserCreateNestedManyWithoutIncomingRequestsInput
    history?: GameCreateNestedManyWithoutPlayersInput
  }

  export type UserUncheckedCreateWithoutIncomingRequestsInput = {
    id?: number
    linkId: number
    username?: string | null
    avatarUrl?: string | null
    wins?: number
    losses?: number
    tournamentWins?: number
    tournamentLosses?: number
    friends?: UserUncheckedCreateNestedManyWithoutFriendOfInput
    friendOf?: UserUncheckedCreateNestedManyWithoutFriendsInput
    outgoingRequests?: UserUncheckedCreateNestedManyWithoutIncomingRequestsInput
    history?: GameUncheckedCreateNestedManyWithoutPlayersInput
  }

  export type UserCreateOrConnectWithoutIncomingRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutIncomingRequestsInput, UserUncheckedCreateWithoutIncomingRequestsInput>
  }

  export type GameCreateWithoutPlayersInput = {
    game: string
    gameId: string
    winner: string
    score: string
    replay: string
    gamePlayers: string
    metadata?: MetadataCreateNestedOneWithoutGameInput
  }

  export type GameUncheckedCreateWithoutPlayersInput = {
    id?: number
    game: string
    gameId: string
    winner: string
    score: string
    replay: string
    gamePlayers: string
    metadataId?: string | null
  }

  export type GameCreateOrConnectWithoutPlayersInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput>
  }

  export type UserUpsertWithWhereUniqueWithoutFriendOfInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutFriendOfInput, UserUncheckedUpdateWithoutFriendOfInput>
    create: XOR<UserCreateWithoutFriendOfInput, UserUncheckedCreateWithoutFriendOfInput>
  }

  export type UserUpdateWithWhereUniqueWithoutFriendOfInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutFriendOfInput, UserUncheckedUpdateWithoutFriendOfInput>
  }

  export type UserUpdateManyWithWhereWithoutFriendOfInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutFriendOfInput>
  }

  export type UserUpsertWithWhereUniqueWithoutFriendsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutFriendsInput, UserUncheckedUpdateWithoutFriendsInput>
    create: XOR<UserCreateWithoutFriendsInput, UserUncheckedCreateWithoutFriendsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutFriendsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutFriendsInput, UserUncheckedUpdateWithoutFriendsInput>
  }

  export type UserUpdateManyWithWhereWithoutFriendsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutFriendsInput>
  }

  export type UserUpsertWithWhereUniqueWithoutOutgoingRequestsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutOutgoingRequestsInput, UserUncheckedUpdateWithoutOutgoingRequestsInput>
    create: XOR<UserCreateWithoutOutgoingRequestsInput, UserUncheckedCreateWithoutOutgoingRequestsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutOutgoingRequestsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutOutgoingRequestsInput, UserUncheckedUpdateWithoutOutgoingRequestsInput>
  }

  export type UserUpdateManyWithWhereWithoutOutgoingRequestsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutOutgoingRequestsInput>
  }

  export type UserUpsertWithWhereUniqueWithoutIncomingRequestsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutIncomingRequestsInput, UserUncheckedUpdateWithoutIncomingRequestsInput>
    create: XOR<UserCreateWithoutIncomingRequestsInput, UserUncheckedCreateWithoutIncomingRequestsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutIncomingRequestsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutIncomingRequestsInput, UserUncheckedUpdateWithoutIncomingRequestsInput>
  }

  export type UserUpdateManyWithWhereWithoutIncomingRequestsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutIncomingRequestsInput>
  }

  export type GameUpsertWithWhereUniqueWithoutPlayersInput = {
    where: GameWhereUniqueInput
    update: XOR<GameUpdateWithoutPlayersInput, GameUncheckedUpdateWithoutPlayersInput>
    create: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput>
  }

  export type GameUpdateWithWhereUniqueWithoutPlayersInput = {
    where: GameWhereUniqueInput
    data: XOR<GameUpdateWithoutPlayersInput, GameUncheckedUpdateWithoutPlayersInput>
  }

  export type GameUpdateManyWithWhereWithoutPlayersInput = {
    where: GameScalarWhereInput
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyWithoutPlayersInput>
  }

  export type GameScalarWhereInput = {
    AND?: GameScalarWhereInput | GameScalarWhereInput[]
    OR?: GameScalarWhereInput[]
    NOT?: GameScalarWhereInput | GameScalarWhereInput[]
    id?: IntFilter<"Game"> | number
    game?: StringFilter<"Game"> | string
    gameId?: StringFilter<"Game"> | string
    winner?: StringFilter<"Game"> | string
    score?: StringFilter<"Game"> | string
    replay?: StringFilter<"Game"> | string
    gamePlayers?: StringFilter<"Game"> | string
    metadataId?: StringNullableFilter<"Game"> | string | null
  }

  export type UserUpdateWithoutHistoryInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friends?: UserUpdateManyWithoutFriendOfNestedInput
    friendOf?: UserUpdateManyWithoutFriendsNestedInput
    incomingRequests?: UserUpdateManyWithoutOutgoingRequestsNestedInput
    outgoingRequests?: UserUpdateManyWithoutIncomingRequestsNestedInput
  }

  export type UserUncheckedUpdateWithoutHistoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friends?: UserUncheckedUpdateManyWithoutFriendOfNestedInput
    friendOf?: UserUncheckedUpdateManyWithoutFriendsNestedInput
    incomingRequests?: UserUncheckedUpdateManyWithoutOutgoingRequestsNestedInput
    outgoingRequests?: UserUncheckedUpdateManyWithoutIncomingRequestsNestedInput
  }

  export type UserUncheckedUpdateManyWithoutHistoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
  }

  export type UserUpdateWithoutFriendOfInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friends?: UserUpdateManyWithoutFriendOfNestedInput
    incomingRequests?: UserUpdateManyWithoutOutgoingRequestsNestedInput
    outgoingRequests?: UserUpdateManyWithoutIncomingRequestsNestedInput
    history?: GameUpdateManyWithoutPlayersNestedInput
  }

  export type UserUncheckedUpdateWithoutFriendOfInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friends?: UserUncheckedUpdateManyWithoutFriendOfNestedInput
    incomingRequests?: UserUncheckedUpdateManyWithoutOutgoingRequestsNestedInput
    outgoingRequests?: UserUncheckedUpdateManyWithoutIncomingRequestsNestedInput
    history?: GameUncheckedUpdateManyWithoutPlayersNestedInput
  }

  export type UserUncheckedUpdateManyWithoutFriendOfInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
  }

  export type UserUpdateWithoutFriendsInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friendOf?: UserUpdateManyWithoutFriendsNestedInput
    incomingRequests?: UserUpdateManyWithoutOutgoingRequestsNestedInput
    outgoingRequests?: UserUpdateManyWithoutIncomingRequestsNestedInput
    history?: GameUpdateManyWithoutPlayersNestedInput
  }

  export type UserUncheckedUpdateWithoutFriendsInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friendOf?: UserUncheckedUpdateManyWithoutFriendsNestedInput
    incomingRequests?: UserUncheckedUpdateManyWithoutOutgoingRequestsNestedInput
    outgoingRequests?: UserUncheckedUpdateManyWithoutIncomingRequestsNestedInput
    history?: GameUncheckedUpdateManyWithoutPlayersNestedInput
  }

  export type UserUncheckedUpdateManyWithoutFriendsInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
  }

  export type UserUpdateWithoutOutgoingRequestsInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friends?: UserUpdateManyWithoutFriendOfNestedInput
    friendOf?: UserUpdateManyWithoutFriendsNestedInput
    incomingRequests?: UserUpdateManyWithoutOutgoingRequestsNestedInput
    history?: GameUpdateManyWithoutPlayersNestedInput
  }

  export type UserUncheckedUpdateWithoutOutgoingRequestsInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friends?: UserUncheckedUpdateManyWithoutFriendOfNestedInput
    friendOf?: UserUncheckedUpdateManyWithoutFriendsNestedInput
    incomingRequests?: UserUncheckedUpdateManyWithoutOutgoingRequestsNestedInput
    history?: GameUncheckedUpdateManyWithoutPlayersNestedInput
  }

  export type UserUncheckedUpdateManyWithoutOutgoingRequestsInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
  }

  export type UserUpdateWithoutIncomingRequestsInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friends?: UserUpdateManyWithoutFriendOfNestedInput
    friendOf?: UserUpdateManyWithoutFriendsNestedInput
    outgoingRequests?: UserUpdateManyWithoutIncomingRequestsNestedInput
    history?: GameUpdateManyWithoutPlayersNestedInput
  }

  export type UserUncheckedUpdateWithoutIncomingRequestsInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
    friends?: UserUncheckedUpdateManyWithoutFriendOfNestedInput
    friendOf?: UserUncheckedUpdateManyWithoutFriendsNestedInput
    outgoingRequests?: UserUncheckedUpdateManyWithoutIncomingRequestsNestedInput
    history?: GameUncheckedUpdateManyWithoutPlayersNestedInput
  }

  export type UserUncheckedUpdateManyWithoutIncomingRequestsInput = {
    id?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    tournamentWins?: IntFieldUpdateOperationsInput | number
    tournamentLosses?: IntFieldUpdateOperationsInput | number
  }

  export type GameUpdateWithoutPlayersInput = {
    game?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    score?: StringFieldUpdateOperationsInput | string
    replay?: StringFieldUpdateOperationsInput | string
    gamePlayers?: StringFieldUpdateOperationsInput | string
    metadata?: MetadataUpdateOneWithoutGameNestedInput
  }

  export type GameUncheckedUpdateWithoutPlayersInput = {
    id?: IntFieldUpdateOperationsInput | number
    game?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    score?: StringFieldUpdateOperationsInput | string
    replay?: StringFieldUpdateOperationsInput | string
    gamePlayers?: StringFieldUpdateOperationsInput | string
    metadataId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameUncheckedUpdateManyWithoutPlayersInput = {
    id?: IntFieldUpdateOperationsInput | number
    game?: StringFieldUpdateOperationsInput | string
    gameId?: StringFieldUpdateOperationsInput | string
    winner?: StringFieldUpdateOperationsInput | string
    score?: StringFieldUpdateOperationsInput | string
    replay?: StringFieldUpdateOperationsInput | string
    gamePlayers?: StringFieldUpdateOperationsInput | string
    metadataId?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}