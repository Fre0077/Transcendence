
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
 * Model score
 * 
 */
export type score = $Result.DefaultSelection<Prisma.$scorePayload>
/**
 * Model player
 * 
 */
export type player = $Result.DefaultSelection<Prisma.$playerPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Scores
 * const scores = await prisma.score.findMany()
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
   * // Fetch zero or more Scores
   * const scores = await prisma.score.findMany()
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
   * `prisma.score`: Exposes CRUD operations for the **score** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Scores
    * const scores = await prisma.score.findMany()
    * ```
    */
  get score(): Prisma.scoreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.player`: Exposes CRUD operations for the **player** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Players
    * const players = await prisma.player.findMany()
    * ```
    */
  get player(): Prisma.playerDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.10.1
   * Query Engine version: 9b628578b3b7cae625e8c927178f15a170e74a9c
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
    score: 'score',
    player: 'player'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    dbprofile?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "score" | "player"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      score: {
        payload: Prisma.$scorePayload<ExtArgs>
        fields: Prisma.scoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.scoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$scorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.scoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$scorePayload>
          }
          findFirst: {
            args: Prisma.scoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$scorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.scoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$scorePayload>
          }
          findMany: {
            args: Prisma.scoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$scorePayload>[]
          }
          create: {
            args: Prisma.scoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$scorePayload>
          }
          createMany: {
            args: Prisma.scoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.scoreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$scorePayload>[]
          }
          delete: {
            args: Prisma.scoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$scorePayload>
          }
          update: {
            args: Prisma.scoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$scorePayload>
          }
          deleteMany: {
            args: Prisma.scoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.scoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.scoreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$scorePayload>[]
          }
          upsert: {
            args: Prisma.scoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$scorePayload>
          }
          aggregate: {
            args: Prisma.ScoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScore>
          }
          groupBy: {
            args: Prisma.scoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.scoreCountArgs<ExtArgs>
            result: $Utils.Optional<ScoreCountAggregateOutputType> | number
          }
        }
      }
      player: {
        payload: Prisma.$playerPayload<ExtArgs>
        fields: Prisma.playerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.playerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$playerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.playerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$playerPayload>
          }
          findFirst: {
            args: Prisma.playerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$playerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.playerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$playerPayload>
          }
          findMany: {
            args: Prisma.playerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$playerPayload>[]
          }
          create: {
            args: Prisma.playerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$playerPayload>
          }
          createMany: {
            args: Prisma.playerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.playerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$playerPayload>[]
          }
          delete: {
            args: Prisma.playerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$playerPayload>
          }
          update: {
            args: Prisma.playerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$playerPayload>
          }
          deleteMany: {
            args: Prisma.playerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.playerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.playerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$playerPayload>[]
          }
          upsert: {
            args: Prisma.playerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$playerPayload>
          }
          aggregate: {
            args: Prisma.PlayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayer>
          }
          groupBy: {
            args: Prisma.playerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.playerCountArgs<ExtArgs>
            result: $Utils.Optional<PlayerCountAggregateOutputType> | number
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
    score?: scoreOmit
    player?: playerOmit
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
   * Count Type PlayerCountOutputType
   */

  export type PlayerCountOutputType = {
    tournament: number
  }

  export type PlayerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tournament?: boolean | PlayerCountOutputTypeCountTournamentArgs
  }

  // Custom InputTypes
  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerCountOutputType
     */
    select?: PlayerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountTournamentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: scoreWhereInput
  }


  /**
   * Models
   */

  /**
   * Model score
   */

  export type AggregateScore = {
    _count: ScoreCountAggregateOutputType | null
    _avg: ScoreAvgAggregateOutputType | null
    _sum: ScoreSumAggregateOutputType | null
    _min: ScoreMinAggregateOutputType | null
    _max: ScoreMaxAggregateOutputType | null
  }

  export type ScoreAvgAggregateOutputType = {
    id: number | null
    playerid: number | null
  }

  export type ScoreSumAggregateOutputType = {
    id: number | null
    playerid: number | null
  }

  export type ScoreMinAggregateOutputType = {
    id: number | null
    playerid: number | null
    score: string | null
    game: string | null
  }

  export type ScoreMaxAggregateOutputType = {
    id: number | null
    playerid: number | null
    score: string | null
    game: string | null
  }

  export type ScoreCountAggregateOutputType = {
    id: number
    playerid: number
    score: number
    game: number
    _all: number
  }


  export type ScoreAvgAggregateInputType = {
    id?: true
    playerid?: true
  }

  export type ScoreSumAggregateInputType = {
    id?: true
    playerid?: true
  }

  export type ScoreMinAggregateInputType = {
    id?: true
    playerid?: true
    score?: true
    game?: true
  }

  export type ScoreMaxAggregateInputType = {
    id?: true
    playerid?: true
    score?: true
    game?: true
  }

  export type ScoreCountAggregateInputType = {
    id?: true
    playerid?: true
    score?: true
    game?: true
    _all?: true
  }

  export type ScoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which score to aggregate.
     */
    where?: scoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of scores to fetch.
     */
    orderBy?: scoreOrderByWithRelationInput | scoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: scoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` scores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned scores
    **/
    _count?: true | ScoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScoreAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScoreSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScoreMaxAggregateInputType
  }

  export type GetScoreAggregateType<T extends ScoreAggregateArgs> = {
        [P in keyof T & keyof AggregateScore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScore[P]>
      : GetScalarType<T[P], AggregateScore[P]>
  }




  export type scoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: scoreWhereInput
    orderBy?: scoreOrderByWithAggregationInput | scoreOrderByWithAggregationInput[]
    by: ScoreScalarFieldEnum[] | ScoreScalarFieldEnum
    having?: scoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScoreCountAggregateInputType | true
    _avg?: ScoreAvgAggregateInputType
    _sum?: ScoreSumAggregateInputType
    _min?: ScoreMinAggregateInputType
    _max?: ScoreMaxAggregateInputType
  }

  export type ScoreGroupByOutputType = {
    id: number
    playerid: number
    score: string
    game: string
    _count: ScoreCountAggregateOutputType | null
    _avg: ScoreAvgAggregateOutputType | null
    _sum: ScoreSumAggregateOutputType | null
    _min: ScoreMinAggregateOutputType | null
    _max: ScoreMaxAggregateOutputType | null
  }

  type GetScoreGroupByPayload<T extends scoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScoreGroupByOutputType[P]>
            : GetScalarType<T[P], ScoreGroupByOutputType[P]>
        }
      >
    >


  export type scoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerid?: boolean
    score?: boolean
    game?: boolean
    user?: boolean | playerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["score"]>

  export type scoreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerid?: boolean
    score?: boolean
    game?: boolean
    user?: boolean | playerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["score"]>

  export type scoreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerid?: boolean
    score?: boolean
    game?: boolean
    user?: boolean | playerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["score"]>

  export type scoreSelectScalar = {
    id?: boolean
    playerid?: boolean
    score?: boolean
    game?: boolean
  }

  export type scoreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "playerid" | "score" | "game", ExtArgs["result"]["score"]>
  export type scoreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | playerDefaultArgs<ExtArgs>
  }
  export type scoreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | playerDefaultArgs<ExtArgs>
  }
  export type scoreIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | playerDefaultArgs<ExtArgs>
  }

  export type $scorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "score"
    objects: {
      user: Prisma.$playerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      playerid: number
      score: string
      game: string
    }, ExtArgs["result"]["score"]>
    composites: {}
  }

  type scoreGetPayload<S extends boolean | null | undefined | scoreDefaultArgs> = $Result.GetResult<Prisma.$scorePayload, S>

  type scoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<scoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScoreCountAggregateInputType | true
    }

  export interface scoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['score'], meta: { name: 'score' } }
    /**
     * Find zero or one Score that matches the filter.
     * @param {scoreFindUniqueArgs} args - Arguments to find a Score
     * @example
     * // Get one Score
     * const score = await prisma.score.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends scoreFindUniqueArgs>(args: SelectSubset<T, scoreFindUniqueArgs<ExtArgs>>): Prisma__scoreClient<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Score that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {scoreFindUniqueOrThrowArgs} args - Arguments to find a Score
     * @example
     * // Get one Score
     * const score = await prisma.score.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends scoreFindUniqueOrThrowArgs>(args: SelectSubset<T, scoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__scoreClient<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Score that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {scoreFindFirstArgs} args - Arguments to find a Score
     * @example
     * // Get one Score
     * const score = await prisma.score.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends scoreFindFirstArgs>(args?: SelectSubset<T, scoreFindFirstArgs<ExtArgs>>): Prisma__scoreClient<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Score that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {scoreFindFirstOrThrowArgs} args - Arguments to find a Score
     * @example
     * // Get one Score
     * const score = await prisma.score.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends scoreFindFirstOrThrowArgs>(args?: SelectSubset<T, scoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__scoreClient<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Scores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {scoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Scores
     * const scores = await prisma.score.findMany()
     * 
     * // Get first 10 Scores
     * const scores = await prisma.score.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scoreWithIdOnly = await prisma.score.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends scoreFindManyArgs>(args?: SelectSubset<T, scoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Score.
     * @param {scoreCreateArgs} args - Arguments to create a Score.
     * @example
     * // Create one Score
     * const Score = await prisma.score.create({
     *   data: {
     *     // ... data to create a Score
     *   }
     * })
     * 
     */
    create<T extends scoreCreateArgs>(args: SelectSubset<T, scoreCreateArgs<ExtArgs>>): Prisma__scoreClient<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Scores.
     * @param {scoreCreateManyArgs} args - Arguments to create many Scores.
     * @example
     * // Create many Scores
     * const score = await prisma.score.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends scoreCreateManyArgs>(args?: SelectSubset<T, scoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Scores and returns the data saved in the database.
     * @param {scoreCreateManyAndReturnArgs} args - Arguments to create many Scores.
     * @example
     * // Create many Scores
     * const score = await prisma.score.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Scores and only return the `id`
     * const scoreWithIdOnly = await prisma.score.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends scoreCreateManyAndReturnArgs>(args?: SelectSubset<T, scoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Score.
     * @param {scoreDeleteArgs} args - Arguments to delete one Score.
     * @example
     * // Delete one Score
     * const Score = await prisma.score.delete({
     *   where: {
     *     // ... filter to delete one Score
     *   }
     * })
     * 
     */
    delete<T extends scoreDeleteArgs>(args: SelectSubset<T, scoreDeleteArgs<ExtArgs>>): Prisma__scoreClient<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Score.
     * @param {scoreUpdateArgs} args - Arguments to update one Score.
     * @example
     * // Update one Score
     * const score = await prisma.score.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends scoreUpdateArgs>(args: SelectSubset<T, scoreUpdateArgs<ExtArgs>>): Prisma__scoreClient<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Scores.
     * @param {scoreDeleteManyArgs} args - Arguments to filter Scores to delete.
     * @example
     * // Delete a few Scores
     * const { count } = await prisma.score.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends scoreDeleteManyArgs>(args?: SelectSubset<T, scoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Scores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {scoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Scores
     * const score = await prisma.score.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends scoreUpdateManyArgs>(args: SelectSubset<T, scoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Scores and returns the data updated in the database.
     * @param {scoreUpdateManyAndReturnArgs} args - Arguments to update many Scores.
     * @example
     * // Update many Scores
     * const score = await prisma.score.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Scores and only return the `id`
     * const scoreWithIdOnly = await prisma.score.updateManyAndReturn({
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
    updateManyAndReturn<T extends scoreUpdateManyAndReturnArgs>(args: SelectSubset<T, scoreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Score.
     * @param {scoreUpsertArgs} args - Arguments to update or create a Score.
     * @example
     * // Update or create a Score
     * const score = await prisma.score.upsert({
     *   create: {
     *     // ... data to create a Score
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Score we want to update
     *   }
     * })
     */
    upsert<T extends scoreUpsertArgs>(args: SelectSubset<T, scoreUpsertArgs<ExtArgs>>): Prisma__scoreClient<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Scores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {scoreCountArgs} args - Arguments to filter Scores to count.
     * @example
     * // Count the number of Scores
     * const count = await prisma.score.count({
     *   where: {
     *     // ... the filter for the Scores we want to count
     *   }
     * })
    **/
    count<T extends scoreCountArgs>(
      args?: Subset<T, scoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Score.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScoreAggregateArgs>(args: Subset<T, ScoreAggregateArgs>): Prisma.PrismaPromise<GetScoreAggregateType<T>>

    /**
     * Group by Score.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {scoreGroupByArgs} args - Group by arguments.
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
      T extends scoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: scoreGroupByArgs['orderBy'] }
        : { orderBy?: scoreGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, scoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the score model
   */
  readonly fields: scoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for score.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__scoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends playerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, playerDefaultArgs<ExtArgs>>): Prisma__playerClient<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the score model
   */
  interface scoreFieldRefs {
    readonly id: FieldRef<"score", 'Int'>
    readonly playerid: FieldRef<"score", 'Int'>
    readonly score: FieldRef<"score", 'String'>
    readonly game: FieldRef<"score", 'String'>
  }
    

  // Custom InputTypes
  /**
   * score findUnique
   */
  export type scoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreInclude<ExtArgs> | null
    /**
     * Filter, which score to fetch.
     */
    where: scoreWhereUniqueInput
  }

  /**
   * score findUniqueOrThrow
   */
  export type scoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreInclude<ExtArgs> | null
    /**
     * Filter, which score to fetch.
     */
    where: scoreWhereUniqueInput
  }

  /**
   * score findFirst
   */
  export type scoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreInclude<ExtArgs> | null
    /**
     * Filter, which score to fetch.
     */
    where?: scoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of scores to fetch.
     */
    orderBy?: scoreOrderByWithRelationInput | scoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for scores.
     */
    cursor?: scoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` scores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of scores.
     */
    distinct?: ScoreScalarFieldEnum | ScoreScalarFieldEnum[]
  }

  /**
   * score findFirstOrThrow
   */
  export type scoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreInclude<ExtArgs> | null
    /**
     * Filter, which score to fetch.
     */
    where?: scoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of scores to fetch.
     */
    orderBy?: scoreOrderByWithRelationInput | scoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for scores.
     */
    cursor?: scoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` scores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of scores.
     */
    distinct?: ScoreScalarFieldEnum | ScoreScalarFieldEnum[]
  }

  /**
   * score findMany
   */
  export type scoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreInclude<ExtArgs> | null
    /**
     * Filter, which scores to fetch.
     */
    where?: scoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of scores to fetch.
     */
    orderBy?: scoreOrderByWithRelationInput | scoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing scores.
     */
    cursor?: scoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` scores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` scores.
     */
    skip?: number
    distinct?: ScoreScalarFieldEnum | ScoreScalarFieldEnum[]
  }

  /**
   * score create
   */
  export type scoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreInclude<ExtArgs> | null
    /**
     * The data needed to create a score.
     */
    data: XOR<scoreCreateInput, scoreUncheckedCreateInput>
  }

  /**
   * score createMany
   */
  export type scoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many scores.
     */
    data: scoreCreateManyInput | scoreCreateManyInput[]
  }

  /**
   * score createManyAndReturn
   */
  export type scoreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * The data used to create many scores.
     */
    data: scoreCreateManyInput | scoreCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * score update
   */
  export type scoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreInclude<ExtArgs> | null
    /**
     * The data needed to update a score.
     */
    data: XOR<scoreUpdateInput, scoreUncheckedUpdateInput>
    /**
     * Choose, which score to update.
     */
    where: scoreWhereUniqueInput
  }

  /**
   * score updateMany
   */
  export type scoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update scores.
     */
    data: XOR<scoreUpdateManyMutationInput, scoreUncheckedUpdateManyInput>
    /**
     * Filter which scores to update
     */
    where?: scoreWhereInput
    /**
     * Limit how many scores to update.
     */
    limit?: number
  }

  /**
   * score updateManyAndReturn
   */
  export type scoreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * The data used to update scores.
     */
    data: XOR<scoreUpdateManyMutationInput, scoreUncheckedUpdateManyInput>
    /**
     * Filter which scores to update
     */
    where?: scoreWhereInput
    /**
     * Limit how many scores to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * score upsert
   */
  export type scoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreInclude<ExtArgs> | null
    /**
     * The filter to search for the score to update in case it exists.
     */
    where: scoreWhereUniqueInput
    /**
     * In case the score found by the `where` argument doesn't exist, create a new score with this data.
     */
    create: XOR<scoreCreateInput, scoreUncheckedCreateInput>
    /**
     * In case the score was found with the provided `where` argument, update it with this data.
     */
    update: XOR<scoreUpdateInput, scoreUncheckedUpdateInput>
  }

  /**
   * score delete
   */
  export type scoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreInclude<ExtArgs> | null
    /**
     * Filter which score to delete.
     */
    where: scoreWhereUniqueInput
  }

  /**
   * score deleteMany
   */
  export type scoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which scores to delete
     */
    where?: scoreWhereInput
    /**
     * Limit how many scores to delete.
     */
    limit?: number
  }

  /**
   * score without action
   */
  export type scoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreInclude<ExtArgs> | null
  }


  /**
   * Model player
   */

  export type AggregatePlayer = {
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  export type PlayerAvgAggregateOutputType = {
    playerid: number | null
  }

  export type PlayerSumAggregateOutputType = {
    playerid: number | null
  }

  export type PlayerMinAggregateOutputType = {
    playerid: number | null
    username: string | null
    bios: string | null
  }

  export type PlayerMaxAggregateOutputType = {
    playerid: number | null
    username: string | null
    bios: string | null
  }

  export type PlayerCountAggregateOutputType = {
    playerid: number
    username: number
    bios: number
    _all: number
  }


  export type PlayerAvgAggregateInputType = {
    playerid?: true
  }

  export type PlayerSumAggregateInputType = {
    playerid?: true
  }

  export type PlayerMinAggregateInputType = {
    playerid?: true
    username?: true
    bios?: true
  }

  export type PlayerMaxAggregateInputType = {
    playerid?: true
    username?: true
    bios?: true
  }

  export type PlayerCountAggregateInputType = {
    playerid?: true
    username?: true
    bios?: true
    _all?: true
  }

  export type PlayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which player to aggregate.
     */
    where?: playerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of players to fetch.
     */
    orderBy?: playerOrderByWithRelationInput | playerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: playerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned players
    **/
    _count?: true | PlayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlayerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlayerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayerMaxAggregateInputType
  }

  export type GetPlayerAggregateType<T extends PlayerAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayer[P]>
      : GetScalarType<T[P], AggregatePlayer[P]>
  }




  export type playerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: playerWhereInput
    orderBy?: playerOrderByWithAggregationInput | playerOrderByWithAggregationInput[]
    by: PlayerScalarFieldEnum[] | PlayerScalarFieldEnum
    having?: playerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayerCountAggregateInputType | true
    _avg?: PlayerAvgAggregateInputType
    _sum?: PlayerSumAggregateInputType
    _min?: PlayerMinAggregateInputType
    _max?: PlayerMaxAggregateInputType
  }

  export type PlayerGroupByOutputType = {
    playerid: number
    username: string
    bios: string
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  type GetPlayerGroupByPayload<T extends playerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayerGroupByOutputType[P]>
            : GetScalarType<T[P], PlayerGroupByOutputType[P]>
        }
      >
    >


  export type playerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    playerid?: boolean
    username?: boolean
    bios?: boolean
    tournament?: boolean | player$tournamentArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type playerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    playerid?: boolean
    username?: boolean
    bios?: boolean
  }, ExtArgs["result"]["player"]>

  export type playerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    playerid?: boolean
    username?: boolean
    bios?: boolean
  }, ExtArgs["result"]["player"]>

  export type playerSelectScalar = {
    playerid?: boolean
    username?: boolean
    bios?: boolean
  }

  export type playerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"playerid" | "username" | "bios", ExtArgs["result"]["player"]>
  export type playerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tournament?: boolean | player$tournamentArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type playerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type playerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $playerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "player"
    objects: {
      tournament: Prisma.$scorePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      playerid: number
      username: string
      bios: string
    }, ExtArgs["result"]["player"]>
    composites: {}
  }

  type playerGetPayload<S extends boolean | null | undefined | playerDefaultArgs> = $Result.GetResult<Prisma.$playerPayload, S>

  type playerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<playerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayerCountAggregateInputType | true
    }

  export interface playerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['player'], meta: { name: 'player' } }
    /**
     * Find zero or one Player that matches the filter.
     * @param {playerFindUniqueArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends playerFindUniqueArgs>(args: SelectSubset<T, playerFindUniqueArgs<ExtArgs>>): Prisma__playerClient<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Player that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {playerFindUniqueOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends playerFindUniqueOrThrowArgs>(args: SelectSubset<T, playerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__playerClient<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {playerFindFirstArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends playerFindFirstArgs>(args?: SelectSubset<T, playerFindFirstArgs<ExtArgs>>): Prisma__playerClient<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {playerFindFirstOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends playerFindFirstOrThrowArgs>(args?: SelectSubset<T, playerFindFirstOrThrowArgs<ExtArgs>>): Prisma__playerClient<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Players that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {playerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Players
     * const players = await prisma.player.findMany()
     * 
     * // Get first 10 Players
     * const players = await prisma.player.findMany({ take: 10 })
     * 
     * // Only select the `playerid`
     * const playerWithPlayeridOnly = await prisma.player.findMany({ select: { playerid: true } })
     * 
     */
    findMany<T extends playerFindManyArgs>(args?: SelectSubset<T, playerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Player.
     * @param {playerCreateArgs} args - Arguments to create a Player.
     * @example
     * // Create one Player
     * const Player = await prisma.player.create({
     *   data: {
     *     // ... data to create a Player
     *   }
     * })
     * 
     */
    create<T extends playerCreateArgs>(args: SelectSubset<T, playerCreateArgs<ExtArgs>>): Prisma__playerClient<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Players.
     * @param {playerCreateManyArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends playerCreateManyArgs>(args?: SelectSubset<T, playerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Players and returns the data saved in the database.
     * @param {playerCreateManyAndReturnArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Players and only return the `playerid`
     * const playerWithPlayeridOnly = await prisma.player.createManyAndReturn({
     *   select: { playerid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends playerCreateManyAndReturnArgs>(args?: SelectSubset<T, playerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Player.
     * @param {playerDeleteArgs} args - Arguments to delete one Player.
     * @example
     * // Delete one Player
     * const Player = await prisma.player.delete({
     *   where: {
     *     // ... filter to delete one Player
     *   }
     * })
     * 
     */
    delete<T extends playerDeleteArgs>(args: SelectSubset<T, playerDeleteArgs<ExtArgs>>): Prisma__playerClient<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Player.
     * @param {playerUpdateArgs} args - Arguments to update one Player.
     * @example
     * // Update one Player
     * const player = await prisma.player.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends playerUpdateArgs>(args: SelectSubset<T, playerUpdateArgs<ExtArgs>>): Prisma__playerClient<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Players.
     * @param {playerDeleteManyArgs} args - Arguments to filter Players to delete.
     * @example
     * // Delete a few Players
     * const { count } = await prisma.player.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends playerDeleteManyArgs>(args?: SelectSubset<T, playerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {playerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends playerUpdateManyArgs>(args: SelectSubset<T, playerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players and returns the data updated in the database.
     * @param {playerUpdateManyAndReturnArgs} args - Arguments to update many Players.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Players and only return the `playerid`
     * const playerWithPlayeridOnly = await prisma.player.updateManyAndReturn({
     *   select: { playerid: true },
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
    updateManyAndReturn<T extends playerUpdateManyAndReturnArgs>(args: SelectSubset<T, playerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Player.
     * @param {playerUpsertArgs} args - Arguments to update or create a Player.
     * @example
     * // Update or create a Player
     * const player = await prisma.player.upsert({
     *   create: {
     *     // ... data to create a Player
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player we want to update
     *   }
     * })
     */
    upsert<T extends playerUpsertArgs>(args: SelectSubset<T, playerUpsertArgs<ExtArgs>>): Prisma__playerClient<$Result.GetResult<Prisma.$playerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {playerCountArgs} args - Arguments to filter Players to count.
     * @example
     * // Count the number of Players
     * const count = await prisma.player.count({
     *   where: {
     *     // ... the filter for the Players we want to count
     *   }
     * })
    **/
    count<T extends playerCountArgs>(
      args?: Subset<T, playerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PlayerAggregateArgs>(args: Subset<T, PlayerAggregateArgs>): Prisma.PrismaPromise<GetPlayerAggregateType<T>>

    /**
     * Group by Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {playerGroupByArgs} args - Group by arguments.
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
      T extends playerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: playerGroupByArgs['orderBy'] }
        : { orderBy?: playerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, playerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the player model
   */
  readonly fields: playerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for player.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__playerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tournament<T extends player$tournamentArgs<ExtArgs> = {}>(args?: Subset<T, player$tournamentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$scorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the player model
   */
  interface playerFieldRefs {
    readonly playerid: FieldRef<"player", 'Int'>
    readonly username: FieldRef<"player", 'String'>
    readonly bios: FieldRef<"player", 'String'>
  }
    

  // Custom InputTypes
  /**
   * player findUnique
   */
  export type playerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: playerInclude<ExtArgs> | null
    /**
     * Filter, which player to fetch.
     */
    where: playerWhereUniqueInput
  }

  /**
   * player findUniqueOrThrow
   */
  export type playerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: playerInclude<ExtArgs> | null
    /**
     * Filter, which player to fetch.
     */
    where: playerWhereUniqueInput
  }

  /**
   * player findFirst
   */
  export type playerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: playerInclude<ExtArgs> | null
    /**
     * Filter, which player to fetch.
     */
    where?: playerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of players to fetch.
     */
    orderBy?: playerOrderByWithRelationInput | playerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for players.
     */
    cursor?: playerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * player findFirstOrThrow
   */
  export type playerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: playerInclude<ExtArgs> | null
    /**
     * Filter, which player to fetch.
     */
    where?: playerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of players to fetch.
     */
    orderBy?: playerOrderByWithRelationInput | playerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for players.
     */
    cursor?: playerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * player findMany
   */
  export type playerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: playerInclude<ExtArgs> | null
    /**
     * Filter, which players to fetch.
     */
    where?: playerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of players to fetch.
     */
    orderBy?: playerOrderByWithRelationInput | playerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing players.
     */
    cursor?: playerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` players.
     */
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * player create
   */
  export type playerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: playerInclude<ExtArgs> | null
    /**
     * The data needed to create a player.
     */
    data: XOR<playerCreateInput, playerUncheckedCreateInput>
  }

  /**
   * player createMany
   */
  export type playerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many players.
     */
    data: playerCreateManyInput | playerCreateManyInput[]
  }

  /**
   * player createManyAndReturn
   */
  export type playerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * The data used to create many players.
     */
    data: playerCreateManyInput | playerCreateManyInput[]
  }

  /**
   * player update
   */
  export type playerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: playerInclude<ExtArgs> | null
    /**
     * The data needed to update a player.
     */
    data: XOR<playerUpdateInput, playerUncheckedUpdateInput>
    /**
     * Choose, which player to update.
     */
    where: playerWhereUniqueInput
  }

  /**
   * player updateMany
   */
  export type playerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update players.
     */
    data: XOR<playerUpdateManyMutationInput, playerUncheckedUpdateManyInput>
    /**
     * Filter which players to update
     */
    where?: playerWhereInput
    /**
     * Limit how many players to update.
     */
    limit?: number
  }

  /**
   * player updateManyAndReturn
   */
  export type playerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * The data used to update players.
     */
    data: XOR<playerUpdateManyMutationInput, playerUncheckedUpdateManyInput>
    /**
     * Filter which players to update
     */
    where?: playerWhereInput
    /**
     * Limit how many players to update.
     */
    limit?: number
  }

  /**
   * player upsert
   */
  export type playerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: playerInclude<ExtArgs> | null
    /**
     * The filter to search for the player to update in case it exists.
     */
    where: playerWhereUniqueInput
    /**
     * In case the player found by the `where` argument doesn't exist, create a new player with this data.
     */
    create: XOR<playerCreateInput, playerUncheckedCreateInput>
    /**
     * In case the player was found with the provided `where` argument, update it with this data.
     */
    update: XOR<playerUpdateInput, playerUncheckedUpdateInput>
  }

  /**
   * player delete
   */
  export type playerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: playerInclude<ExtArgs> | null
    /**
     * Filter which player to delete.
     */
    where: playerWhereUniqueInput
  }

  /**
   * player deleteMany
   */
  export type playerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which players to delete
     */
    where?: playerWhereInput
    /**
     * Limit how many players to delete.
     */
    limit?: number
  }

  /**
   * player.tournament
   */
  export type player$tournamentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the score
     */
    select?: scoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the score
     */
    omit?: scoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: scoreInclude<ExtArgs> | null
    where?: scoreWhereInput
    orderBy?: scoreOrderByWithRelationInput | scoreOrderByWithRelationInput[]
    cursor?: scoreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScoreScalarFieldEnum | ScoreScalarFieldEnum[]
  }

  /**
   * player without action
   */
  export type playerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player
     */
    select?: playerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the player
     */
    omit?: playerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: playerInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ScoreScalarFieldEnum: {
    id: 'id',
    playerid: 'playerid',
    score: 'score',
    game: 'game'
  };

  export type ScoreScalarFieldEnum = (typeof ScoreScalarFieldEnum)[keyof typeof ScoreScalarFieldEnum]


  export const PlayerScalarFieldEnum: {
    playerid: 'playerid',
    username: 'username',
    bios: 'bios'
  };

  export type PlayerScalarFieldEnum = (typeof PlayerScalarFieldEnum)[keyof typeof PlayerScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type scoreWhereInput = {
    AND?: scoreWhereInput | scoreWhereInput[]
    OR?: scoreWhereInput[]
    NOT?: scoreWhereInput | scoreWhereInput[]
    id?: IntFilter<"score"> | number
    playerid?: IntFilter<"score"> | number
    score?: StringFilter<"score"> | string
    game?: StringFilter<"score"> | string
    user?: XOR<PlayerScalarRelationFilter, playerWhereInput>
  }

  export type scoreOrderByWithRelationInput = {
    id?: SortOrder
    playerid?: SortOrder
    score?: SortOrder
    game?: SortOrder
    user?: playerOrderByWithRelationInput
  }

  export type scoreWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    playerid?: number
    AND?: scoreWhereInput | scoreWhereInput[]
    OR?: scoreWhereInput[]
    NOT?: scoreWhereInput | scoreWhereInput[]
    score?: StringFilter<"score"> | string
    game?: StringFilter<"score"> | string
    user?: XOR<PlayerScalarRelationFilter, playerWhereInput>
  }, "id" | "playerid">

  export type scoreOrderByWithAggregationInput = {
    id?: SortOrder
    playerid?: SortOrder
    score?: SortOrder
    game?: SortOrder
    _count?: scoreCountOrderByAggregateInput
    _avg?: scoreAvgOrderByAggregateInput
    _max?: scoreMaxOrderByAggregateInput
    _min?: scoreMinOrderByAggregateInput
    _sum?: scoreSumOrderByAggregateInput
  }

  export type scoreScalarWhereWithAggregatesInput = {
    AND?: scoreScalarWhereWithAggregatesInput | scoreScalarWhereWithAggregatesInput[]
    OR?: scoreScalarWhereWithAggregatesInput[]
    NOT?: scoreScalarWhereWithAggregatesInput | scoreScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"score"> | number
    playerid?: IntWithAggregatesFilter<"score"> | number
    score?: StringWithAggregatesFilter<"score"> | string
    game?: StringWithAggregatesFilter<"score"> | string
  }

  export type playerWhereInput = {
    AND?: playerWhereInput | playerWhereInput[]
    OR?: playerWhereInput[]
    NOT?: playerWhereInput | playerWhereInput[]
    playerid?: IntFilter<"player"> | number
    username?: StringFilter<"player"> | string
    bios?: StringFilter<"player"> | string
    tournament?: ScoreListRelationFilter
  }

  export type playerOrderByWithRelationInput = {
    playerid?: SortOrder
    username?: SortOrder
    bios?: SortOrder
    tournament?: scoreOrderByRelationAggregateInput
  }

  export type playerWhereUniqueInput = Prisma.AtLeast<{
    playerid?: number
    username?: string
    AND?: playerWhereInput | playerWhereInput[]
    OR?: playerWhereInput[]
    NOT?: playerWhereInput | playerWhereInput[]
    bios?: StringFilter<"player"> | string
    tournament?: ScoreListRelationFilter
  }, "playerid" | "username">

  export type playerOrderByWithAggregationInput = {
    playerid?: SortOrder
    username?: SortOrder
    bios?: SortOrder
    _count?: playerCountOrderByAggregateInput
    _avg?: playerAvgOrderByAggregateInput
    _max?: playerMaxOrderByAggregateInput
    _min?: playerMinOrderByAggregateInput
    _sum?: playerSumOrderByAggregateInput
  }

  export type playerScalarWhereWithAggregatesInput = {
    AND?: playerScalarWhereWithAggregatesInput | playerScalarWhereWithAggregatesInput[]
    OR?: playerScalarWhereWithAggregatesInput[]
    NOT?: playerScalarWhereWithAggregatesInput | playerScalarWhereWithAggregatesInput[]
    playerid?: IntWithAggregatesFilter<"player"> | number
    username?: StringWithAggregatesFilter<"player"> | string
    bios?: StringWithAggregatesFilter<"player"> | string
  }

  export type scoreCreateInput = {
    score: string
    game: string
    user: playerCreateNestedOneWithoutTournamentInput
  }

  export type scoreUncheckedCreateInput = {
    id?: number
    playerid: number
    score: string
    game: string
  }

  export type scoreUpdateInput = {
    score?: StringFieldUpdateOperationsInput | string
    game?: StringFieldUpdateOperationsInput | string
    user?: playerUpdateOneRequiredWithoutTournamentNestedInput
  }

  export type scoreUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    playerid?: IntFieldUpdateOperationsInput | number
    score?: StringFieldUpdateOperationsInput | string
    game?: StringFieldUpdateOperationsInput | string
  }

  export type scoreCreateManyInput = {
    id?: number
    playerid: number
    score: string
    game: string
  }

  export type scoreUpdateManyMutationInput = {
    score?: StringFieldUpdateOperationsInput | string
    game?: StringFieldUpdateOperationsInput | string
  }

  export type scoreUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    playerid?: IntFieldUpdateOperationsInput | number
    score?: StringFieldUpdateOperationsInput | string
    game?: StringFieldUpdateOperationsInput | string
  }

  export type playerCreateInput = {
    username: string
    bios: string
    tournament?: scoreCreateNestedManyWithoutUserInput
  }

  export type playerUncheckedCreateInput = {
    playerid?: number
    username: string
    bios: string
    tournament?: scoreUncheckedCreateNestedManyWithoutUserInput
  }

  export type playerUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    bios?: StringFieldUpdateOperationsInput | string
    tournament?: scoreUpdateManyWithoutUserNestedInput
  }

  export type playerUncheckedUpdateInput = {
    playerid?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    bios?: StringFieldUpdateOperationsInput | string
    tournament?: scoreUncheckedUpdateManyWithoutUserNestedInput
  }

  export type playerCreateManyInput = {
    playerid?: number
    username: string
    bios: string
  }

  export type playerUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    bios?: StringFieldUpdateOperationsInput | string
  }

  export type playerUncheckedUpdateManyInput = {
    playerid?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    bios?: StringFieldUpdateOperationsInput | string
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

  export type PlayerScalarRelationFilter = {
    is?: playerWhereInput
    isNot?: playerWhereInput
  }

  export type scoreCountOrderByAggregateInput = {
    id?: SortOrder
    playerid?: SortOrder
    score?: SortOrder
    game?: SortOrder
  }

  export type scoreAvgOrderByAggregateInput = {
    id?: SortOrder
    playerid?: SortOrder
  }

  export type scoreMaxOrderByAggregateInput = {
    id?: SortOrder
    playerid?: SortOrder
    score?: SortOrder
    game?: SortOrder
  }

  export type scoreMinOrderByAggregateInput = {
    id?: SortOrder
    playerid?: SortOrder
    score?: SortOrder
    game?: SortOrder
  }

  export type scoreSumOrderByAggregateInput = {
    id?: SortOrder
    playerid?: SortOrder
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

  export type ScoreListRelationFilter = {
    every?: scoreWhereInput
    some?: scoreWhereInput
    none?: scoreWhereInput
  }

  export type scoreOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type playerCountOrderByAggregateInput = {
    playerid?: SortOrder
    username?: SortOrder
    bios?: SortOrder
  }

  export type playerAvgOrderByAggregateInput = {
    playerid?: SortOrder
  }

  export type playerMaxOrderByAggregateInput = {
    playerid?: SortOrder
    username?: SortOrder
    bios?: SortOrder
  }

  export type playerMinOrderByAggregateInput = {
    playerid?: SortOrder
    username?: SortOrder
    bios?: SortOrder
  }

  export type playerSumOrderByAggregateInput = {
    playerid?: SortOrder
  }

  export type playerCreateNestedOneWithoutTournamentInput = {
    create?: XOR<playerCreateWithoutTournamentInput, playerUncheckedCreateWithoutTournamentInput>
    connectOrCreate?: playerCreateOrConnectWithoutTournamentInput
    connect?: playerWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type playerUpdateOneRequiredWithoutTournamentNestedInput = {
    create?: XOR<playerCreateWithoutTournamentInput, playerUncheckedCreateWithoutTournamentInput>
    connectOrCreate?: playerCreateOrConnectWithoutTournamentInput
    upsert?: playerUpsertWithoutTournamentInput
    connect?: playerWhereUniqueInput
    update?: XOR<XOR<playerUpdateToOneWithWhereWithoutTournamentInput, playerUpdateWithoutTournamentInput>, playerUncheckedUpdateWithoutTournamentInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type scoreCreateNestedManyWithoutUserInput = {
    create?: XOR<scoreCreateWithoutUserInput, scoreUncheckedCreateWithoutUserInput> | scoreCreateWithoutUserInput[] | scoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: scoreCreateOrConnectWithoutUserInput | scoreCreateOrConnectWithoutUserInput[]
    createMany?: scoreCreateManyUserInputEnvelope
    connect?: scoreWhereUniqueInput | scoreWhereUniqueInput[]
  }

  export type scoreUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<scoreCreateWithoutUserInput, scoreUncheckedCreateWithoutUserInput> | scoreCreateWithoutUserInput[] | scoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: scoreCreateOrConnectWithoutUserInput | scoreCreateOrConnectWithoutUserInput[]
    createMany?: scoreCreateManyUserInputEnvelope
    connect?: scoreWhereUniqueInput | scoreWhereUniqueInput[]
  }

  export type scoreUpdateManyWithoutUserNestedInput = {
    create?: XOR<scoreCreateWithoutUserInput, scoreUncheckedCreateWithoutUserInput> | scoreCreateWithoutUserInput[] | scoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: scoreCreateOrConnectWithoutUserInput | scoreCreateOrConnectWithoutUserInput[]
    upsert?: scoreUpsertWithWhereUniqueWithoutUserInput | scoreUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: scoreCreateManyUserInputEnvelope
    set?: scoreWhereUniqueInput | scoreWhereUniqueInput[]
    disconnect?: scoreWhereUniqueInput | scoreWhereUniqueInput[]
    delete?: scoreWhereUniqueInput | scoreWhereUniqueInput[]
    connect?: scoreWhereUniqueInput | scoreWhereUniqueInput[]
    update?: scoreUpdateWithWhereUniqueWithoutUserInput | scoreUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: scoreUpdateManyWithWhereWithoutUserInput | scoreUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: scoreScalarWhereInput | scoreScalarWhereInput[]
  }

  export type scoreUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<scoreCreateWithoutUserInput, scoreUncheckedCreateWithoutUserInput> | scoreCreateWithoutUserInput[] | scoreUncheckedCreateWithoutUserInput[]
    connectOrCreate?: scoreCreateOrConnectWithoutUserInput | scoreCreateOrConnectWithoutUserInput[]
    upsert?: scoreUpsertWithWhereUniqueWithoutUserInput | scoreUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: scoreCreateManyUserInputEnvelope
    set?: scoreWhereUniqueInput | scoreWhereUniqueInput[]
    disconnect?: scoreWhereUniqueInput | scoreWhereUniqueInput[]
    delete?: scoreWhereUniqueInput | scoreWhereUniqueInput[]
    connect?: scoreWhereUniqueInput | scoreWhereUniqueInput[]
    update?: scoreUpdateWithWhereUniqueWithoutUserInput | scoreUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: scoreUpdateManyWithWhereWithoutUserInput | scoreUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: scoreScalarWhereInput | scoreScalarWhereInput[]
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

  export type playerCreateWithoutTournamentInput = {
    username: string
    bios: string
  }

  export type playerUncheckedCreateWithoutTournamentInput = {
    playerid?: number
    username: string
    bios: string
  }

  export type playerCreateOrConnectWithoutTournamentInput = {
    where: playerWhereUniqueInput
    create: XOR<playerCreateWithoutTournamentInput, playerUncheckedCreateWithoutTournamentInput>
  }

  export type playerUpsertWithoutTournamentInput = {
    update: XOR<playerUpdateWithoutTournamentInput, playerUncheckedUpdateWithoutTournamentInput>
    create: XOR<playerCreateWithoutTournamentInput, playerUncheckedCreateWithoutTournamentInput>
    where?: playerWhereInput
  }

  export type playerUpdateToOneWithWhereWithoutTournamentInput = {
    where?: playerWhereInput
    data: XOR<playerUpdateWithoutTournamentInput, playerUncheckedUpdateWithoutTournamentInput>
  }

  export type playerUpdateWithoutTournamentInput = {
    username?: StringFieldUpdateOperationsInput | string
    bios?: StringFieldUpdateOperationsInput | string
  }

  export type playerUncheckedUpdateWithoutTournamentInput = {
    playerid?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    bios?: StringFieldUpdateOperationsInput | string
  }

  export type scoreCreateWithoutUserInput = {
    score: string
    game: string
  }

  export type scoreUncheckedCreateWithoutUserInput = {
    id?: number
    score: string
    game: string
  }

  export type scoreCreateOrConnectWithoutUserInput = {
    where: scoreWhereUniqueInput
    create: XOR<scoreCreateWithoutUserInput, scoreUncheckedCreateWithoutUserInput>
  }

  export type scoreCreateManyUserInputEnvelope = {
    data: scoreCreateManyUserInput | scoreCreateManyUserInput[]
  }

  export type scoreUpsertWithWhereUniqueWithoutUserInput = {
    where: scoreWhereUniqueInput
    update: XOR<scoreUpdateWithoutUserInput, scoreUncheckedUpdateWithoutUserInput>
    create: XOR<scoreCreateWithoutUserInput, scoreUncheckedCreateWithoutUserInput>
  }

  export type scoreUpdateWithWhereUniqueWithoutUserInput = {
    where: scoreWhereUniqueInput
    data: XOR<scoreUpdateWithoutUserInput, scoreUncheckedUpdateWithoutUserInput>
  }

  export type scoreUpdateManyWithWhereWithoutUserInput = {
    where: scoreScalarWhereInput
    data: XOR<scoreUpdateManyMutationInput, scoreUncheckedUpdateManyWithoutUserInput>
  }

  export type scoreScalarWhereInput = {
    AND?: scoreScalarWhereInput | scoreScalarWhereInput[]
    OR?: scoreScalarWhereInput[]
    NOT?: scoreScalarWhereInput | scoreScalarWhereInput[]
    id?: IntFilter<"score"> | number
    playerid?: IntFilter<"score"> | number
    score?: StringFilter<"score"> | string
    game?: StringFilter<"score"> | string
  }

  export type scoreCreateManyUserInput = {
    id?: number
    score: string
    game: string
  }

  export type scoreUpdateWithoutUserInput = {
    score?: StringFieldUpdateOperationsInput | string
    game?: StringFieldUpdateOperationsInput | string
  }

  export type scoreUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    score?: StringFieldUpdateOperationsInput | string
    game?: StringFieldUpdateOperationsInput | string
  }

  export type scoreUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    score?: StringFieldUpdateOperationsInput | string
    game?: StringFieldUpdateOperationsInput | string
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