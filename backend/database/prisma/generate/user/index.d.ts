
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
 * Model accoutn
 * 
 */
export type accoutn = $Result.DefaultSelection<Prisma.$accoutnPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accoutns
 * const accoutns = await prisma.accoutn.findMany()
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
   * // Fetch zero or more Accoutns
   * const accoutns = await prisma.accoutn.findMany()
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
   * `prisma.accoutn`: Exposes CRUD operations for the **accoutn** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accoutns
    * const accoutns = await prisma.accoutn.findMany()
    * ```
    */
  get accoutn(): Prisma.accoutnDelegate<ExtArgs, ClientOptions>;
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
    accoutn: 'accoutn'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    dbuser?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "accoutn"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      accoutn: {
        payload: Prisma.$accoutnPayload<ExtArgs>
        fields: Prisma.accoutnFieldRefs
        operations: {
          findUnique: {
            args: Prisma.accoutnFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accoutnPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.accoutnFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accoutnPayload>
          }
          findFirst: {
            args: Prisma.accoutnFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accoutnPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.accoutnFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accoutnPayload>
          }
          findMany: {
            args: Prisma.accoutnFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accoutnPayload>[]
          }
          create: {
            args: Prisma.accoutnCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accoutnPayload>
          }
          createMany: {
            args: Prisma.accoutnCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.accoutnCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accoutnPayload>[]
          }
          delete: {
            args: Prisma.accoutnDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accoutnPayload>
          }
          update: {
            args: Prisma.accoutnUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accoutnPayload>
          }
          deleteMany: {
            args: Prisma.accoutnDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.accoutnUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.accoutnUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accoutnPayload>[]
          }
          upsert: {
            args: Prisma.accoutnUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accoutnPayload>
          }
          aggregate: {
            args: Prisma.AccoutnAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccoutn>
          }
          groupBy: {
            args: Prisma.accoutnGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccoutnGroupByOutputType>[]
          }
          count: {
            args: Prisma.accoutnCountArgs<ExtArgs>
            result: $Utils.Optional<AccoutnCountAggregateOutputType> | number
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
    accoutn?: accoutnOmit
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
   * Models
   */

  /**
   * Model accoutn
   */

  export type AggregateAccoutn = {
    _count: AccoutnCountAggregateOutputType | null
    _avg: AccoutnAvgAggregateOutputType | null
    _sum: AccoutnSumAggregateOutputType | null
    _min: AccoutnMinAggregateOutputType | null
    _max: AccoutnMaxAggregateOutputType | null
  }

  export type AccoutnAvgAggregateOutputType = {
    id: number | null
  }

  export type AccoutnSumAggregateOutputType = {
    id: number | null
  }

  export type AccoutnMinAggregateOutputType = {
    id: number | null
    name: string | null
    surname: string | null
    username: string | null
    email: string | null
    password: string | null
  }

  export type AccoutnMaxAggregateOutputType = {
    id: number | null
    name: string | null
    surname: string | null
    username: string | null
    email: string | null
    password: string | null
  }

  export type AccoutnCountAggregateOutputType = {
    id: number
    name: number
    surname: number
    username: number
    email: number
    password: number
    _all: number
  }


  export type AccoutnAvgAggregateInputType = {
    id?: true
  }

  export type AccoutnSumAggregateInputType = {
    id?: true
  }

  export type AccoutnMinAggregateInputType = {
    id?: true
    name?: true
    surname?: true
    username?: true
    email?: true
    password?: true
  }

  export type AccoutnMaxAggregateInputType = {
    id?: true
    name?: true
    surname?: true
    username?: true
    email?: true
    password?: true
  }

  export type AccoutnCountAggregateInputType = {
    id?: true
    name?: true
    surname?: true
    username?: true
    email?: true
    password?: true
    _all?: true
  }

  export type AccoutnAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accoutn to aggregate.
     */
    where?: accoutnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accoutns to fetch.
     */
    orderBy?: accoutnOrderByWithRelationInput | accoutnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: accoutnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accoutns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accoutns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned accoutns
    **/
    _count?: true | AccoutnCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccoutnAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccoutnSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccoutnMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccoutnMaxAggregateInputType
  }

  export type GetAccoutnAggregateType<T extends AccoutnAggregateArgs> = {
        [P in keyof T & keyof AggregateAccoutn]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccoutn[P]>
      : GetScalarType<T[P], AggregateAccoutn[P]>
  }




  export type accoutnGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: accoutnWhereInput
    orderBy?: accoutnOrderByWithAggregationInput | accoutnOrderByWithAggregationInput[]
    by: AccoutnScalarFieldEnum[] | AccoutnScalarFieldEnum
    having?: accoutnScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccoutnCountAggregateInputType | true
    _avg?: AccoutnAvgAggregateInputType
    _sum?: AccoutnSumAggregateInputType
    _min?: AccoutnMinAggregateInputType
    _max?: AccoutnMaxAggregateInputType
  }

  export type AccoutnGroupByOutputType = {
    id: number
    name: string
    surname: string
    username: string
    email: string
    password: string
    _count: AccoutnCountAggregateOutputType | null
    _avg: AccoutnAvgAggregateOutputType | null
    _sum: AccoutnSumAggregateOutputType | null
    _min: AccoutnMinAggregateOutputType | null
    _max: AccoutnMaxAggregateOutputType | null
  }

  type GetAccoutnGroupByPayload<T extends accoutnGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccoutnGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccoutnGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccoutnGroupByOutputType[P]>
            : GetScalarType<T[P], AccoutnGroupByOutputType[P]>
        }
      >
    >


  export type accoutnSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    surname?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
  }, ExtArgs["result"]["accoutn"]>

  export type accoutnSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    surname?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
  }, ExtArgs["result"]["accoutn"]>

  export type accoutnSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    surname?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
  }, ExtArgs["result"]["accoutn"]>

  export type accoutnSelectScalar = {
    id?: boolean
    name?: boolean
    surname?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
  }

  export type accoutnOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "surname" | "username" | "email" | "password", ExtArgs["result"]["accoutn"]>

  export type $accoutnPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "accoutn"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      surname: string
      username: string
      email: string
      password: string
    }, ExtArgs["result"]["accoutn"]>
    composites: {}
  }

  type accoutnGetPayload<S extends boolean | null | undefined | accoutnDefaultArgs> = $Result.GetResult<Prisma.$accoutnPayload, S>

  type accoutnCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<accoutnFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccoutnCountAggregateInputType | true
    }

  export interface accoutnDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['accoutn'], meta: { name: 'accoutn' } }
    /**
     * Find zero or one Accoutn that matches the filter.
     * @param {accoutnFindUniqueArgs} args - Arguments to find a Accoutn
     * @example
     * // Get one Accoutn
     * const accoutn = await prisma.accoutn.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends accoutnFindUniqueArgs>(args: SelectSubset<T, accoutnFindUniqueArgs<ExtArgs>>): Prisma__accoutnClient<$Result.GetResult<Prisma.$accoutnPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Accoutn that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {accoutnFindUniqueOrThrowArgs} args - Arguments to find a Accoutn
     * @example
     * // Get one Accoutn
     * const accoutn = await prisma.accoutn.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends accoutnFindUniqueOrThrowArgs>(args: SelectSubset<T, accoutnFindUniqueOrThrowArgs<ExtArgs>>): Prisma__accoutnClient<$Result.GetResult<Prisma.$accoutnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accoutn that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accoutnFindFirstArgs} args - Arguments to find a Accoutn
     * @example
     * // Get one Accoutn
     * const accoutn = await prisma.accoutn.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends accoutnFindFirstArgs>(args?: SelectSubset<T, accoutnFindFirstArgs<ExtArgs>>): Prisma__accoutnClient<$Result.GetResult<Prisma.$accoutnPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accoutn that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accoutnFindFirstOrThrowArgs} args - Arguments to find a Accoutn
     * @example
     * // Get one Accoutn
     * const accoutn = await prisma.accoutn.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends accoutnFindFirstOrThrowArgs>(args?: SelectSubset<T, accoutnFindFirstOrThrowArgs<ExtArgs>>): Prisma__accoutnClient<$Result.GetResult<Prisma.$accoutnPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accoutns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accoutnFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accoutns
     * const accoutns = await prisma.accoutn.findMany()
     * 
     * // Get first 10 Accoutns
     * const accoutns = await prisma.accoutn.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accoutnWithIdOnly = await prisma.accoutn.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends accoutnFindManyArgs>(args?: SelectSubset<T, accoutnFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accoutnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Accoutn.
     * @param {accoutnCreateArgs} args - Arguments to create a Accoutn.
     * @example
     * // Create one Accoutn
     * const Accoutn = await prisma.accoutn.create({
     *   data: {
     *     // ... data to create a Accoutn
     *   }
     * })
     * 
     */
    create<T extends accoutnCreateArgs>(args: SelectSubset<T, accoutnCreateArgs<ExtArgs>>): Prisma__accoutnClient<$Result.GetResult<Prisma.$accoutnPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accoutns.
     * @param {accoutnCreateManyArgs} args - Arguments to create many Accoutns.
     * @example
     * // Create many Accoutns
     * const accoutn = await prisma.accoutn.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends accoutnCreateManyArgs>(args?: SelectSubset<T, accoutnCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accoutns and returns the data saved in the database.
     * @param {accoutnCreateManyAndReturnArgs} args - Arguments to create many Accoutns.
     * @example
     * // Create many Accoutns
     * const accoutn = await prisma.accoutn.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accoutns and only return the `id`
     * const accoutnWithIdOnly = await prisma.accoutn.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends accoutnCreateManyAndReturnArgs>(args?: SelectSubset<T, accoutnCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accoutnPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Accoutn.
     * @param {accoutnDeleteArgs} args - Arguments to delete one Accoutn.
     * @example
     * // Delete one Accoutn
     * const Accoutn = await prisma.accoutn.delete({
     *   where: {
     *     // ... filter to delete one Accoutn
     *   }
     * })
     * 
     */
    delete<T extends accoutnDeleteArgs>(args: SelectSubset<T, accoutnDeleteArgs<ExtArgs>>): Prisma__accoutnClient<$Result.GetResult<Prisma.$accoutnPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Accoutn.
     * @param {accoutnUpdateArgs} args - Arguments to update one Accoutn.
     * @example
     * // Update one Accoutn
     * const accoutn = await prisma.accoutn.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends accoutnUpdateArgs>(args: SelectSubset<T, accoutnUpdateArgs<ExtArgs>>): Prisma__accoutnClient<$Result.GetResult<Prisma.$accoutnPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accoutns.
     * @param {accoutnDeleteManyArgs} args - Arguments to filter Accoutns to delete.
     * @example
     * // Delete a few Accoutns
     * const { count } = await prisma.accoutn.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends accoutnDeleteManyArgs>(args?: SelectSubset<T, accoutnDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accoutns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accoutnUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accoutns
     * const accoutn = await prisma.accoutn.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends accoutnUpdateManyArgs>(args: SelectSubset<T, accoutnUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accoutns and returns the data updated in the database.
     * @param {accoutnUpdateManyAndReturnArgs} args - Arguments to update many Accoutns.
     * @example
     * // Update many Accoutns
     * const accoutn = await prisma.accoutn.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accoutns and only return the `id`
     * const accoutnWithIdOnly = await prisma.accoutn.updateManyAndReturn({
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
    updateManyAndReturn<T extends accoutnUpdateManyAndReturnArgs>(args: SelectSubset<T, accoutnUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accoutnPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Accoutn.
     * @param {accoutnUpsertArgs} args - Arguments to update or create a Accoutn.
     * @example
     * // Update or create a Accoutn
     * const accoutn = await prisma.accoutn.upsert({
     *   create: {
     *     // ... data to create a Accoutn
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Accoutn we want to update
     *   }
     * })
     */
    upsert<T extends accoutnUpsertArgs>(args: SelectSubset<T, accoutnUpsertArgs<ExtArgs>>): Prisma__accoutnClient<$Result.GetResult<Prisma.$accoutnPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accoutns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accoutnCountArgs} args - Arguments to filter Accoutns to count.
     * @example
     * // Count the number of Accoutns
     * const count = await prisma.accoutn.count({
     *   where: {
     *     // ... the filter for the Accoutns we want to count
     *   }
     * })
    **/
    count<T extends accoutnCountArgs>(
      args?: Subset<T, accoutnCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccoutnCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Accoutn.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccoutnAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccoutnAggregateArgs>(args: Subset<T, AccoutnAggregateArgs>): Prisma.PrismaPromise<GetAccoutnAggregateType<T>>

    /**
     * Group by Accoutn.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accoutnGroupByArgs} args - Group by arguments.
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
      T extends accoutnGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: accoutnGroupByArgs['orderBy'] }
        : { orderBy?: accoutnGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, accoutnGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccoutnGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the accoutn model
   */
  readonly fields: accoutnFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for accoutn.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__accoutnClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the accoutn model
   */
  interface accoutnFieldRefs {
    readonly id: FieldRef<"accoutn", 'Int'>
    readonly name: FieldRef<"accoutn", 'String'>
    readonly surname: FieldRef<"accoutn", 'String'>
    readonly username: FieldRef<"accoutn", 'String'>
    readonly email: FieldRef<"accoutn", 'String'>
    readonly password: FieldRef<"accoutn", 'String'>
  }
    

  // Custom InputTypes
  /**
   * accoutn findUnique
   */
  export type accoutnFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
    /**
     * Filter, which accoutn to fetch.
     */
    where: accoutnWhereUniqueInput
  }

  /**
   * accoutn findUniqueOrThrow
   */
  export type accoutnFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
    /**
     * Filter, which accoutn to fetch.
     */
    where: accoutnWhereUniqueInput
  }

  /**
   * accoutn findFirst
   */
  export type accoutnFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
    /**
     * Filter, which accoutn to fetch.
     */
    where?: accoutnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accoutns to fetch.
     */
    orderBy?: accoutnOrderByWithRelationInput | accoutnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accoutns.
     */
    cursor?: accoutnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accoutns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accoutns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accoutns.
     */
    distinct?: AccoutnScalarFieldEnum | AccoutnScalarFieldEnum[]
  }

  /**
   * accoutn findFirstOrThrow
   */
  export type accoutnFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
    /**
     * Filter, which accoutn to fetch.
     */
    where?: accoutnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accoutns to fetch.
     */
    orderBy?: accoutnOrderByWithRelationInput | accoutnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accoutns.
     */
    cursor?: accoutnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accoutns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accoutns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accoutns.
     */
    distinct?: AccoutnScalarFieldEnum | AccoutnScalarFieldEnum[]
  }

  /**
   * accoutn findMany
   */
  export type accoutnFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
    /**
     * Filter, which accoutns to fetch.
     */
    where?: accoutnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accoutns to fetch.
     */
    orderBy?: accoutnOrderByWithRelationInput | accoutnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing accoutns.
     */
    cursor?: accoutnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accoutns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accoutns.
     */
    skip?: number
    distinct?: AccoutnScalarFieldEnum | AccoutnScalarFieldEnum[]
  }

  /**
   * accoutn create
   */
  export type accoutnCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
    /**
     * The data needed to create a accoutn.
     */
    data: XOR<accoutnCreateInput, accoutnUncheckedCreateInput>
  }

  /**
   * accoutn createMany
   */
  export type accoutnCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many accoutns.
     */
    data: accoutnCreateManyInput | accoutnCreateManyInput[]
  }

  /**
   * accoutn createManyAndReturn
   */
  export type accoutnCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
    /**
     * The data used to create many accoutns.
     */
    data: accoutnCreateManyInput | accoutnCreateManyInput[]
  }

  /**
   * accoutn update
   */
  export type accoutnUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
    /**
     * The data needed to update a accoutn.
     */
    data: XOR<accoutnUpdateInput, accoutnUncheckedUpdateInput>
    /**
     * Choose, which accoutn to update.
     */
    where: accoutnWhereUniqueInput
  }

  /**
   * accoutn updateMany
   */
  export type accoutnUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update accoutns.
     */
    data: XOR<accoutnUpdateManyMutationInput, accoutnUncheckedUpdateManyInput>
    /**
     * Filter which accoutns to update
     */
    where?: accoutnWhereInput
    /**
     * Limit how many accoutns to update.
     */
    limit?: number
  }

  /**
   * accoutn updateManyAndReturn
   */
  export type accoutnUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
    /**
     * The data used to update accoutns.
     */
    data: XOR<accoutnUpdateManyMutationInput, accoutnUncheckedUpdateManyInput>
    /**
     * Filter which accoutns to update
     */
    where?: accoutnWhereInput
    /**
     * Limit how many accoutns to update.
     */
    limit?: number
  }

  /**
   * accoutn upsert
   */
  export type accoutnUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
    /**
     * The filter to search for the accoutn to update in case it exists.
     */
    where: accoutnWhereUniqueInput
    /**
     * In case the accoutn found by the `where` argument doesn't exist, create a new accoutn with this data.
     */
    create: XOR<accoutnCreateInput, accoutnUncheckedCreateInput>
    /**
     * In case the accoutn was found with the provided `where` argument, update it with this data.
     */
    update: XOR<accoutnUpdateInput, accoutnUncheckedUpdateInput>
  }

  /**
   * accoutn delete
   */
  export type accoutnDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
    /**
     * Filter which accoutn to delete.
     */
    where: accoutnWhereUniqueInput
  }

  /**
   * accoutn deleteMany
   */
  export type accoutnDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accoutns to delete
     */
    where?: accoutnWhereInput
    /**
     * Limit how many accoutns to delete.
     */
    limit?: number
  }

  /**
   * accoutn without action
   */
  export type accoutnDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accoutn
     */
    select?: accoutnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accoutn
     */
    omit?: accoutnOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccoutnScalarFieldEnum: {
    id: 'id',
    name: 'name',
    surname: 'surname',
    username: 'username',
    email: 'email',
    password: 'password'
  };

  export type AccoutnScalarFieldEnum = (typeof AccoutnScalarFieldEnum)[keyof typeof AccoutnScalarFieldEnum]


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


  export type accoutnWhereInput = {
    AND?: accoutnWhereInput | accoutnWhereInput[]
    OR?: accoutnWhereInput[]
    NOT?: accoutnWhereInput | accoutnWhereInput[]
    id?: IntFilter<"accoutn"> | number
    name?: StringFilter<"accoutn"> | string
    surname?: StringFilter<"accoutn"> | string
    username?: StringFilter<"accoutn"> | string
    email?: StringFilter<"accoutn"> | string
    password?: StringFilter<"accoutn"> | string
  }

  export type accoutnOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
  }

  export type accoutnWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    email?: string
    AND?: accoutnWhereInput | accoutnWhereInput[]
    OR?: accoutnWhereInput[]
    NOT?: accoutnWhereInput | accoutnWhereInput[]
    name?: StringFilter<"accoutn"> | string
    surname?: StringFilter<"accoutn"> | string
    password?: StringFilter<"accoutn"> | string
  }, "id" | "username" | "email">

  export type accoutnOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    _count?: accoutnCountOrderByAggregateInput
    _avg?: accoutnAvgOrderByAggregateInput
    _max?: accoutnMaxOrderByAggregateInput
    _min?: accoutnMinOrderByAggregateInput
    _sum?: accoutnSumOrderByAggregateInput
  }

  export type accoutnScalarWhereWithAggregatesInput = {
    AND?: accoutnScalarWhereWithAggregatesInput | accoutnScalarWhereWithAggregatesInput[]
    OR?: accoutnScalarWhereWithAggregatesInput[]
    NOT?: accoutnScalarWhereWithAggregatesInput | accoutnScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"accoutn"> | number
    name?: StringWithAggregatesFilter<"accoutn"> | string
    surname?: StringWithAggregatesFilter<"accoutn"> | string
    username?: StringWithAggregatesFilter<"accoutn"> | string
    email?: StringWithAggregatesFilter<"accoutn"> | string
    password?: StringWithAggregatesFilter<"accoutn"> | string
  }

  export type accoutnCreateInput = {
    name: string
    surname: string
    username: string
    email: string
    password: string
  }

  export type accoutnUncheckedCreateInput = {
    id?: number
    name: string
    surname: string
    username: string
    email: string
    password: string
  }

  export type accoutnUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    surname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type accoutnUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    surname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type accoutnCreateManyInput = {
    id?: number
    name: string
    surname: string
    username: string
    email: string
    password: string
  }

  export type accoutnUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    surname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type accoutnUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    surname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
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

  export type accoutnCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
  }

  export type accoutnAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type accoutnMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
  }

  export type accoutnMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
  }

  export type accoutnSumOrderByAggregateInput = {
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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