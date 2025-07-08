
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
 * Model messages
 * 
 */
export type messages = $Result.DefaultSelection<Prisma.$messagesPayload>
/**
 * Model chats
 * 
 */
export type chats = $Result.DefaultSelection<Prisma.$chatsPayload>
/**
 * Model user
 * 
 */
export type user = $Result.DefaultSelection<Prisma.$userPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Messages
 * const messages = await prisma.messages.findMany()
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
   * // Fetch zero or more Messages
   * const messages = await prisma.messages.findMany()
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
   * `prisma.messages`: Exposes CRUD operations for the **messages** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.messages.findMany()
    * ```
    */
  get messages(): Prisma.messagesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chats`: Exposes CRUD operations for the **chats** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Chats
    * const chats = await prisma.chats.findMany()
    * ```
    */
  get chats(): Prisma.chatsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **user** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.userDelegate<ExtArgs, ClientOptions>;
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
    messages: 'messages',
    chats: 'chats',
    user: 'user'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    dbchat?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "messages" | "chats" | "user"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      messages: {
        payload: Prisma.$messagesPayload<ExtArgs>
        fields: Prisma.messagesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.messagesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.messagesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          findFirst: {
            args: Prisma.messagesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.messagesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          findMany: {
            args: Prisma.messagesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>[]
          }
          create: {
            args: Prisma.messagesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          createMany: {
            args: Prisma.messagesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.messagesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>[]
          }
          delete: {
            args: Prisma.messagesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          update: {
            args: Prisma.messagesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          deleteMany: {
            args: Prisma.messagesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.messagesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.messagesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>[]
          }
          upsert: {
            args: Prisma.messagesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$messagesPayload>
          }
          aggregate: {
            args: Prisma.MessagesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessages>
          }
          groupBy: {
            args: Prisma.messagesGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessagesGroupByOutputType>[]
          }
          count: {
            args: Prisma.messagesCountArgs<ExtArgs>
            result: $Utils.Optional<MessagesCountAggregateOutputType> | number
          }
        }
      }
      chats: {
        payload: Prisma.$chatsPayload<ExtArgs>
        fields: Prisma.chatsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.chatsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chatsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.chatsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chatsPayload>
          }
          findFirst: {
            args: Prisma.chatsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chatsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.chatsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chatsPayload>
          }
          findMany: {
            args: Prisma.chatsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chatsPayload>[]
          }
          create: {
            args: Prisma.chatsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chatsPayload>
          }
          createMany: {
            args: Prisma.chatsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.chatsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chatsPayload>[]
          }
          delete: {
            args: Prisma.chatsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chatsPayload>
          }
          update: {
            args: Prisma.chatsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chatsPayload>
          }
          deleteMany: {
            args: Prisma.chatsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.chatsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.chatsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chatsPayload>[]
          }
          upsert: {
            args: Prisma.chatsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chatsPayload>
          }
          aggregate: {
            args: Prisma.ChatsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChats>
          }
          groupBy: {
            args: Prisma.chatsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatsGroupByOutputType>[]
          }
          count: {
            args: Prisma.chatsCountArgs<ExtArgs>
            result: $Utils.Optional<ChatsCountAggregateOutputType> | number
          }
        }
      }
      user: {
        payload: Prisma.$userPayload<ExtArgs>
        fields: Prisma.userFieldRefs
        operations: {
          findUnique: {
            args: Prisma.userFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.userFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findFirst: {
            args: Prisma.userFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.userFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          findMany: {
            args: Prisma.userFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          create: {
            args: Prisma.userCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          createMany: {
            args: Prisma.userCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.userCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          delete: {
            args: Prisma.userDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          update: {
            args: Prisma.userUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          deleteMany: {
            args: Prisma.userDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.userUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.userUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>[]
          }
          upsert: {
            args: Prisma.userUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$userPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.userGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.userCountArgs<ExtArgs>
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
    messages?: messagesOmit
    chats?: chatsOmit
    user?: userOmit
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
   * Count Type ChatsCountOutputType
   */

  export type ChatsCountOutputType = {
    users: number
    messages: number
  }

  export type ChatsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | ChatsCountOutputTypeCountUsersArgs
    messages?: boolean | ChatsCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ChatsCountOutputType without action
   */
  export type ChatsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatsCountOutputType
     */
    select?: ChatsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatsCountOutputType without action
   */
  export type ChatsCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userWhereInput
  }

  /**
   * ChatsCountOutputType without action
   */
  export type ChatsCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: messagesWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    messages: number
    chatHost: number
    members: number
    blockedUsers: number
    blockedBy: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | UserCountOutputTypeCountMessagesArgs
    chatHost?: boolean | UserCountOutputTypeCountChatHostArgs
    members?: boolean | UserCountOutputTypeCountMembersArgs
    blockedUsers?: boolean | UserCountOutputTypeCountBlockedUsersArgs
    blockedBy?: boolean | UserCountOutputTypeCountBlockedByArgs
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
  export type UserCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: messagesWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChatHostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: chatsWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: chatsWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBlockedUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBlockedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userWhereInput
  }


  /**
   * Models
   */

  /**
   * Model messages
   */

  export type AggregateMessages = {
    _count: MessagesCountAggregateOutputType | null
    _avg: MessagesAvgAggregateOutputType | null
    _sum: MessagesSumAggregateOutputType | null
    _min: MessagesMinAggregateOutputType | null
    _max: MessagesMaxAggregateOutputType | null
  }

  export type MessagesAvgAggregateOutputType = {
    id: number | null
    chatId: number | null
    userId: number | null
  }

  export type MessagesSumAggregateOutputType = {
    id: number | null
    chatId: number | null
    userId: number | null
  }

  export type MessagesMinAggregateOutputType = {
    id: number | null
    chatId: number | null
    userId: number | null
    message: string | null
    date: Date | null
  }

  export type MessagesMaxAggregateOutputType = {
    id: number | null
    chatId: number | null
    userId: number | null
    message: string | null
    date: Date | null
  }

  export type MessagesCountAggregateOutputType = {
    id: number
    chatId: number
    userId: number
    message: number
    date: number
    _all: number
  }


  export type MessagesAvgAggregateInputType = {
    id?: true
    chatId?: true
    userId?: true
  }

  export type MessagesSumAggregateInputType = {
    id?: true
    chatId?: true
    userId?: true
  }

  export type MessagesMinAggregateInputType = {
    id?: true
    chatId?: true
    userId?: true
    message?: true
    date?: true
  }

  export type MessagesMaxAggregateInputType = {
    id?: true
    chatId?: true
    userId?: true
    message?: true
    date?: true
  }

  export type MessagesCountAggregateInputType = {
    id?: true
    chatId?: true
    userId?: true
    message?: true
    date?: true
    _all?: true
  }

  export type MessagesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which messages to aggregate.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: messagesOrderByWithRelationInput | messagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned messages
    **/
    _count?: true | MessagesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MessagesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MessagesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessagesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessagesMaxAggregateInputType
  }

  export type GetMessagesAggregateType<T extends MessagesAggregateArgs> = {
        [P in keyof T & keyof AggregateMessages]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessages[P]>
      : GetScalarType<T[P], AggregateMessages[P]>
  }




  export type messagesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: messagesWhereInput
    orderBy?: messagesOrderByWithAggregationInput | messagesOrderByWithAggregationInput[]
    by: MessagesScalarFieldEnum[] | MessagesScalarFieldEnum
    having?: messagesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessagesCountAggregateInputType | true
    _avg?: MessagesAvgAggregateInputType
    _sum?: MessagesSumAggregateInputType
    _min?: MessagesMinAggregateInputType
    _max?: MessagesMaxAggregateInputType
  }

  export type MessagesGroupByOutputType = {
    id: number
    chatId: number
    userId: number
    message: string
    date: Date
    _count: MessagesCountAggregateOutputType | null
    _avg: MessagesAvgAggregateOutputType | null
    _sum: MessagesSumAggregateOutputType | null
    _min: MessagesMinAggregateOutputType | null
    _max: MessagesMaxAggregateOutputType | null
  }

  type GetMessagesGroupByPayload<T extends messagesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessagesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessagesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessagesGroupByOutputType[P]>
            : GetScalarType<T[P], MessagesGroupByOutputType[P]>
        }
      >
    >


  export type messagesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatId?: boolean
    userId?: boolean
    message?: boolean
    date?: boolean
    chat?: boolean | chatsDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["messages"]>

  export type messagesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatId?: boolean
    userId?: boolean
    message?: boolean
    date?: boolean
    chat?: boolean | chatsDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["messages"]>

  export type messagesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chatId?: boolean
    userId?: boolean
    message?: boolean
    date?: boolean
    chat?: boolean | chatsDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["messages"]>

  export type messagesSelectScalar = {
    id?: boolean
    chatId?: boolean
    userId?: boolean
    message?: boolean
    date?: boolean
  }

  export type messagesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "chatId" | "userId" | "message" | "date", ExtArgs["result"]["messages"]>
  export type messagesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chat?: boolean | chatsDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }
  export type messagesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chat?: boolean | chatsDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }
  export type messagesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chat?: boolean | chatsDefaultArgs<ExtArgs>
    user?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $messagesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "messages"
    objects: {
      chat: Prisma.$chatsPayload<ExtArgs>
      user: Prisma.$userPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      chatId: number
      userId: number
      message: string
      date: Date
    }, ExtArgs["result"]["messages"]>
    composites: {}
  }

  type messagesGetPayload<S extends boolean | null | undefined | messagesDefaultArgs> = $Result.GetResult<Prisma.$messagesPayload, S>

  type messagesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<messagesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessagesCountAggregateInputType | true
    }

  export interface messagesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['messages'], meta: { name: 'messages' } }
    /**
     * Find zero or one Messages that matches the filter.
     * @param {messagesFindUniqueArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends messagesFindUniqueArgs>(args: SelectSubset<T, messagesFindUniqueArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Messages that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {messagesFindUniqueOrThrowArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends messagesFindUniqueOrThrowArgs>(args: SelectSubset<T, messagesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesFindFirstArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends messagesFindFirstArgs>(args?: SelectSubset<T, messagesFindFirstArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Messages that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesFindFirstOrThrowArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends messagesFindFirstOrThrowArgs>(args?: SelectSubset<T, messagesFindFirstOrThrowArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.messages.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.messages.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messagesWithIdOnly = await prisma.messages.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends messagesFindManyArgs>(args?: SelectSubset<T, messagesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Messages.
     * @param {messagesCreateArgs} args - Arguments to create a Messages.
     * @example
     * // Create one Messages
     * const Messages = await prisma.messages.create({
     *   data: {
     *     // ... data to create a Messages
     *   }
     * })
     * 
     */
    create<T extends messagesCreateArgs>(args: SelectSubset<T, messagesCreateArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {messagesCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const messages = await prisma.messages.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends messagesCreateManyArgs>(args?: SelectSubset<T, messagesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {messagesCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const messages = await prisma.messages.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messagesWithIdOnly = await prisma.messages.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends messagesCreateManyAndReturnArgs>(args?: SelectSubset<T, messagesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Messages.
     * @param {messagesDeleteArgs} args - Arguments to delete one Messages.
     * @example
     * // Delete one Messages
     * const Messages = await prisma.messages.delete({
     *   where: {
     *     // ... filter to delete one Messages
     *   }
     * })
     * 
     */
    delete<T extends messagesDeleteArgs>(args: SelectSubset<T, messagesDeleteArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Messages.
     * @param {messagesUpdateArgs} args - Arguments to update one Messages.
     * @example
     * // Update one Messages
     * const messages = await prisma.messages.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends messagesUpdateArgs>(args: SelectSubset<T, messagesUpdateArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {messagesDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.messages.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends messagesDeleteManyArgs>(args?: SelectSubset<T, messagesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const messages = await prisma.messages.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends messagesUpdateManyArgs>(args: SelectSubset<T, messagesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {messagesUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const messages = await prisma.messages.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messagesWithIdOnly = await prisma.messages.updateManyAndReturn({
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
    updateManyAndReturn<T extends messagesUpdateManyAndReturnArgs>(args: SelectSubset<T, messagesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Messages.
     * @param {messagesUpsertArgs} args - Arguments to update or create a Messages.
     * @example
     * // Update or create a Messages
     * const messages = await prisma.messages.upsert({
     *   create: {
     *     // ... data to create a Messages
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Messages we want to update
     *   }
     * })
     */
    upsert<T extends messagesUpsertArgs>(args: SelectSubset<T, messagesUpsertArgs<ExtArgs>>): Prisma__messagesClient<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.messages.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends messagesCountArgs>(
      args?: Subset<T, messagesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessagesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessagesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MessagesAggregateArgs>(args: Subset<T, MessagesAggregateArgs>): Prisma.PrismaPromise<GetMessagesAggregateType<T>>

    /**
     * Group by Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesGroupByArgs} args - Group by arguments.
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
      T extends messagesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: messagesGroupByArgs['orderBy'] }
        : { orderBy?: messagesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, messagesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessagesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the messages model
   */
  readonly fields: messagesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for messages.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__messagesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    chat<T extends chatsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, chatsDefaultArgs<ExtArgs>>): Prisma__chatsClient<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the messages model
   */
  interface messagesFieldRefs {
    readonly id: FieldRef<"messages", 'Int'>
    readonly chatId: FieldRef<"messages", 'Int'>
    readonly userId: FieldRef<"messages", 'Int'>
    readonly message: FieldRef<"messages", 'String'>
    readonly date: FieldRef<"messages", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * messages findUnique
   */
  export type messagesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where: messagesWhereUniqueInput
  }

  /**
   * messages findUniqueOrThrow
   */
  export type messagesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where: messagesWhereUniqueInput
  }

  /**
   * messages findFirst
   */
  export type messagesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: messagesOrderByWithRelationInput | messagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for messages.
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of messages.
     */
    distinct?: MessagesScalarFieldEnum | MessagesScalarFieldEnum[]
  }

  /**
   * messages findFirstOrThrow
   */
  export type messagesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: messagesOrderByWithRelationInput | messagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for messages.
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of messages.
     */
    distinct?: MessagesScalarFieldEnum | MessagesScalarFieldEnum[]
  }

  /**
   * messages findMany
   */
  export type messagesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: messagesOrderByWithRelationInput | messagesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing messages.
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    distinct?: MessagesScalarFieldEnum | MessagesScalarFieldEnum[]
  }

  /**
   * messages create
   */
  export type messagesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * The data needed to create a messages.
     */
    data: XOR<messagesCreateInput, messagesUncheckedCreateInput>
  }

  /**
   * messages createMany
   */
  export type messagesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many messages.
     */
    data: messagesCreateManyInput | messagesCreateManyInput[]
  }

  /**
   * messages createManyAndReturn
   */
  export type messagesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * The data used to create many messages.
     */
    data: messagesCreateManyInput | messagesCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * messages update
   */
  export type messagesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * The data needed to update a messages.
     */
    data: XOR<messagesUpdateInput, messagesUncheckedUpdateInput>
    /**
     * Choose, which messages to update.
     */
    where: messagesWhereUniqueInput
  }

  /**
   * messages updateMany
   */
  export type messagesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update messages.
     */
    data: XOR<messagesUpdateManyMutationInput, messagesUncheckedUpdateManyInput>
    /**
     * Filter which messages to update
     */
    where?: messagesWhereInput
    /**
     * Limit how many messages to update.
     */
    limit?: number
  }

  /**
   * messages updateManyAndReturn
   */
  export type messagesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * The data used to update messages.
     */
    data: XOR<messagesUpdateManyMutationInput, messagesUncheckedUpdateManyInput>
    /**
     * Filter which messages to update
     */
    where?: messagesWhereInput
    /**
     * Limit how many messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * messages upsert
   */
  export type messagesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * The filter to search for the messages to update in case it exists.
     */
    where: messagesWhereUniqueInput
    /**
     * In case the messages found by the `where` argument doesn't exist, create a new messages with this data.
     */
    create: XOR<messagesCreateInput, messagesUncheckedCreateInput>
    /**
     * In case the messages was found with the provided `where` argument, update it with this data.
     */
    update: XOR<messagesUpdateInput, messagesUncheckedUpdateInput>
  }

  /**
   * messages delete
   */
  export type messagesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter which messages to delete.
     */
    where: messagesWhereUniqueInput
  }

  /**
   * messages deleteMany
   */
  export type messagesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which messages to delete
     */
    where?: messagesWhereInput
    /**
     * Limit how many messages to delete.
     */
    limit?: number
  }

  /**
   * messages without action
   */
  export type messagesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
  }


  /**
   * Model chats
   */

  export type AggregateChats = {
    _count: ChatsCountAggregateOutputType | null
    _avg: ChatsAvgAggregateOutputType | null
    _sum: ChatsSumAggregateOutputType | null
    _min: ChatsMinAggregateOutputType | null
    _max: ChatsMaxAggregateOutputType | null
  }

  export type ChatsAvgAggregateOutputType = {
    chatId: number | null
    hostId: number | null
  }

  export type ChatsSumAggregateOutputType = {
    chatId: number | null
    hostId: number | null
  }

  export type ChatsMinAggregateOutputType = {
    chatId: number | null
    hostId: number | null
    name: string | null
    lastAccessed: Date | null
  }

  export type ChatsMaxAggregateOutputType = {
    chatId: number | null
    hostId: number | null
    name: string | null
    lastAccessed: Date | null
  }

  export type ChatsCountAggregateOutputType = {
    chatId: number
    hostId: number
    name: number
    lastAccessed: number
    _all: number
  }


  export type ChatsAvgAggregateInputType = {
    chatId?: true
    hostId?: true
  }

  export type ChatsSumAggregateInputType = {
    chatId?: true
    hostId?: true
  }

  export type ChatsMinAggregateInputType = {
    chatId?: true
    hostId?: true
    name?: true
    lastAccessed?: true
  }

  export type ChatsMaxAggregateInputType = {
    chatId?: true
    hostId?: true
    name?: true
    lastAccessed?: true
  }

  export type ChatsCountAggregateInputType = {
    chatId?: true
    hostId?: true
    name?: true
    lastAccessed?: true
    _all?: true
  }

  export type ChatsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which chats to aggregate.
     */
    where?: chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chats to fetch.
     */
    orderBy?: chatsOrderByWithRelationInput | chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned chats
    **/
    _count?: true | ChatsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChatsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChatsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatsMaxAggregateInputType
  }

  export type GetChatsAggregateType<T extends ChatsAggregateArgs> = {
        [P in keyof T & keyof AggregateChats]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChats[P]>
      : GetScalarType<T[P], AggregateChats[P]>
  }




  export type chatsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: chatsWhereInput
    orderBy?: chatsOrderByWithAggregationInput | chatsOrderByWithAggregationInput[]
    by: ChatsScalarFieldEnum[] | ChatsScalarFieldEnum
    having?: chatsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatsCountAggregateInputType | true
    _avg?: ChatsAvgAggregateInputType
    _sum?: ChatsSumAggregateInputType
    _min?: ChatsMinAggregateInputType
    _max?: ChatsMaxAggregateInputType
  }

  export type ChatsGroupByOutputType = {
    chatId: number
    hostId: number
    name: string
    lastAccessed: Date | null
    _count: ChatsCountAggregateOutputType | null
    _avg: ChatsAvgAggregateOutputType | null
    _sum: ChatsSumAggregateOutputType | null
    _min: ChatsMinAggregateOutputType | null
    _max: ChatsMaxAggregateOutputType | null
  }

  type GetChatsGroupByPayload<T extends chatsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatsGroupByOutputType[P]>
            : GetScalarType<T[P], ChatsGroupByOutputType[P]>
        }
      >
    >


  export type chatsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    chatId?: boolean
    hostId?: boolean
    name?: boolean
    lastAccessed?: boolean
    host?: boolean | userDefaultArgs<ExtArgs>
    users?: boolean | chats$usersArgs<ExtArgs>
    messages?: boolean | chats$messagesArgs<ExtArgs>
    _count?: boolean | ChatsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chats"]>

  export type chatsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    chatId?: boolean
    hostId?: boolean
    name?: boolean
    lastAccessed?: boolean
    host?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chats"]>

  export type chatsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    chatId?: boolean
    hostId?: boolean
    name?: boolean
    lastAccessed?: boolean
    host?: boolean | userDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chats"]>

  export type chatsSelectScalar = {
    chatId?: boolean
    hostId?: boolean
    name?: boolean
    lastAccessed?: boolean
  }

  export type chatsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"chatId" | "hostId" | "name" | "lastAccessed", ExtArgs["result"]["chats"]>
  export type chatsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    host?: boolean | userDefaultArgs<ExtArgs>
    users?: boolean | chats$usersArgs<ExtArgs>
    messages?: boolean | chats$messagesArgs<ExtArgs>
    _count?: boolean | ChatsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type chatsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    host?: boolean | userDefaultArgs<ExtArgs>
  }
  export type chatsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    host?: boolean | userDefaultArgs<ExtArgs>
  }

  export type $chatsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "chats"
    objects: {
      host: Prisma.$userPayload<ExtArgs>
      users: Prisma.$userPayload<ExtArgs>[]
      messages: Prisma.$messagesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      chatId: number
      hostId: number
      name: string
      lastAccessed: Date | null
    }, ExtArgs["result"]["chats"]>
    composites: {}
  }

  type chatsGetPayload<S extends boolean | null | undefined | chatsDefaultArgs> = $Result.GetResult<Prisma.$chatsPayload, S>

  type chatsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<chatsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatsCountAggregateInputType | true
    }

  export interface chatsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['chats'], meta: { name: 'chats' } }
    /**
     * Find zero or one Chats that matches the filter.
     * @param {chatsFindUniqueArgs} args - Arguments to find a Chats
     * @example
     * // Get one Chats
     * const chats = await prisma.chats.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends chatsFindUniqueArgs>(args: SelectSubset<T, chatsFindUniqueArgs<ExtArgs>>): Prisma__chatsClient<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Chats that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {chatsFindUniqueOrThrowArgs} args - Arguments to find a Chats
     * @example
     * // Get one Chats
     * const chats = await prisma.chats.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends chatsFindUniqueOrThrowArgs>(args: SelectSubset<T, chatsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__chatsClient<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatsFindFirstArgs} args - Arguments to find a Chats
     * @example
     * // Get one Chats
     * const chats = await prisma.chats.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends chatsFindFirstArgs>(args?: SelectSubset<T, chatsFindFirstArgs<ExtArgs>>): Prisma__chatsClient<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chats that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatsFindFirstOrThrowArgs} args - Arguments to find a Chats
     * @example
     * // Get one Chats
     * const chats = await prisma.chats.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends chatsFindFirstOrThrowArgs>(args?: SelectSubset<T, chatsFindFirstOrThrowArgs<ExtArgs>>): Prisma__chatsClient<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Chats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Chats
     * const chats = await prisma.chats.findMany()
     * 
     * // Get first 10 Chats
     * const chats = await prisma.chats.findMany({ take: 10 })
     * 
     * // Only select the `chatId`
     * const chatsWithChatIdOnly = await prisma.chats.findMany({ select: { chatId: true } })
     * 
     */
    findMany<T extends chatsFindManyArgs>(args?: SelectSubset<T, chatsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Chats.
     * @param {chatsCreateArgs} args - Arguments to create a Chats.
     * @example
     * // Create one Chats
     * const Chats = await prisma.chats.create({
     *   data: {
     *     // ... data to create a Chats
     *   }
     * })
     * 
     */
    create<T extends chatsCreateArgs>(args: SelectSubset<T, chatsCreateArgs<ExtArgs>>): Prisma__chatsClient<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Chats.
     * @param {chatsCreateManyArgs} args - Arguments to create many Chats.
     * @example
     * // Create many Chats
     * const chats = await prisma.chats.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends chatsCreateManyArgs>(args?: SelectSubset<T, chatsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Chats and returns the data saved in the database.
     * @param {chatsCreateManyAndReturnArgs} args - Arguments to create many Chats.
     * @example
     * // Create many Chats
     * const chats = await prisma.chats.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Chats and only return the `chatId`
     * const chatsWithChatIdOnly = await prisma.chats.createManyAndReturn({
     *   select: { chatId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends chatsCreateManyAndReturnArgs>(args?: SelectSubset<T, chatsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Chats.
     * @param {chatsDeleteArgs} args - Arguments to delete one Chats.
     * @example
     * // Delete one Chats
     * const Chats = await prisma.chats.delete({
     *   where: {
     *     // ... filter to delete one Chats
     *   }
     * })
     * 
     */
    delete<T extends chatsDeleteArgs>(args: SelectSubset<T, chatsDeleteArgs<ExtArgs>>): Prisma__chatsClient<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Chats.
     * @param {chatsUpdateArgs} args - Arguments to update one Chats.
     * @example
     * // Update one Chats
     * const chats = await prisma.chats.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends chatsUpdateArgs>(args: SelectSubset<T, chatsUpdateArgs<ExtArgs>>): Prisma__chatsClient<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Chats.
     * @param {chatsDeleteManyArgs} args - Arguments to filter Chats to delete.
     * @example
     * // Delete a few Chats
     * const { count } = await prisma.chats.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends chatsDeleteManyArgs>(args?: SelectSubset<T, chatsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Chats
     * const chats = await prisma.chats.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends chatsUpdateManyArgs>(args: SelectSubset<T, chatsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chats and returns the data updated in the database.
     * @param {chatsUpdateManyAndReturnArgs} args - Arguments to update many Chats.
     * @example
     * // Update many Chats
     * const chats = await prisma.chats.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Chats and only return the `chatId`
     * const chatsWithChatIdOnly = await prisma.chats.updateManyAndReturn({
     *   select: { chatId: true },
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
    updateManyAndReturn<T extends chatsUpdateManyAndReturnArgs>(args: SelectSubset<T, chatsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Chats.
     * @param {chatsUpsertArgs} args - Arguments to update or create a Chats.
     * @example
     * // Update or create a Chats
     * const chats = await prisma.chats.upsert({
     *   create: {
     *     // ... data to create a Chats
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Chats we want to update
     *   }
     * })
     */
    upsert<T extends chatsUpsertArgs>(args: SelectSubset<T, chatsUpsertArgs<ExtArgs>>): Prisma__chatsClient<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatsCountArgs} args - Arguments to filter Chats to count.
     * @example
     * // Count the number of Chats
     * const count = await prisma.chats.count({
     *   where: {
     *     // ... the filter for the Chats we want to count
     *   }
     * })
    **/
    count<T extends chatsCountArgs>(
      args?: Subset<T, chatsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChatsAggregateArgs>(args: Subset<T, ChatsAggregateArgs>): Prisma.PrismaPromise<GetChatsAggregateType<T>>

    /**
     * Group by Chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chatsGroupByArgs} args - Group by arguments.
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
      T extends chatsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: chatsGroupByArgs['orderBy'] }
        : { orderBy?: chatsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, chatsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the chats model
   */
  readonly fields: chatsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for chats.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__chatsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    host<T extends userDefaultArgs<ExtArgs> = {}>(args?: Subset<T, userDefaultArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    users<T extends chats$usersArgs<ExtArgs> = {}>(args?: Subset<T, chats$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends chats$messagesArgs<ExtArgs> = {}>(args?: Subset<T, chats$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the chats model
   */
  interface chatsFieldRefs {
    readonly chatId: FieldRef<"chats", 'Int'>
    readonly hostId: FieldRef<"chats", 'Int'>
    readonly name: FieldRef<"chats", 'String'>
    readonly lastAccessed: FieldRef<"chats", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * chats findUnique
   */
  export type chatsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
    /**
     * Filter, which chats to fetch.
     */
    where: chatsWhereUniqueInput
  }

  /**
   * chats findUniqueOrThrow
   */
  export type chatsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
    /**
     * Filter, which chats to fetch.
     */
    where: chatsWhereUniqueInput
  }

  /**
   * chats findFirst
   */
  export type chatsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
    /**
     * Filter, which chats to fetch.
     */
    where?: chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chats to fetch.
     */
    orderBy?: chatsOrderByWithRelationInput | chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for chats.
     */
    cursor?: chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of chats.
     */
    distinct?: ChatsScalarFieldEnum | ChatsScalarFieldEnum[]
  }

  /**
   * chats findFirstOrThrow
   */
  export type chatsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
    /**
     * Filter, which chats to fetch.
     */
    where?: chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chats to fetch.
     */
    orderBy?: chatsOrderByWithRelationInput | chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for chats.
     */
    cursor?: chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of chats.
     */
    distinct?: ChatsScalarFieldEnum | ChatsScalarFieldEnum[]
  }

  /**
   * chats findMany
   */
  export type chatsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
    /**
     * Filter, which chats to fetch.
     */
    where?: chatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chats to fetch.
     */
    orderBy?: chatsOrderByWithRelationInput | chatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing chats.
     */
    cursor?: chatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chats.
     */
    skip?: number
    distinct?: ChatsScalarFieldEnum | ChatsScalarFieldEnum[]
  }

  /**
   * chats create
   */
  export type chatsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
    /**
     * The data needed to create a chats.
     */
    data: XOR<chatsCreateInput, chatsUncheckedCreateInput>
  }

  /**
   * chats createMany
   */
  export type chatsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many chats.
     */
    data: chatsCreateManyInput | chatsCreateManyInput[]
  }

  /**
   * chats createManyAndReturn
   */
  export type chatsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * The data used to create many chats.
     */
    data: chatsCreateManyInput | chatsCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * chats update
   */
  export type chatsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
    /**
     * The data needed to update a chats.
     */
    data: XOR<chatsUpdateInput, chatsUncheckedUpdateInput>
    /**
     * Choose, which chats to update.
     */
    where: chatsWhereUniqueInput
  }

  /**
   * chats updateMany
   */
  export type chatsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update chats.
     */
    data: XOR<chatsUpdateManyMutationInput, chatsUncheckedUpdateManyInput>
    /**
     * Filter which chats to update
     */
    where?: chatsWhereInput
    /**
     * Limit how many chats to update.
     */
    limit?: number
  }

  /**
   * chats updateManyAndReturn
   */
  export type chatsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * The data used to update chats.
     */
    data: XOR<chatsUpdateManyMutationInput, chatsUncheckedUpdateManyInput>
    /**
     * Filter which chats to update
     */
    where?: chatsWhereInput
    /**
     * Limit how many chats to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * chats upsert
   */
  export type chatsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
    /**
     * The filter to search for the chats to update in case it exists.
     */
    where: chatsWhereUniqueInput
    /**
     * In case the chats found by the `where` argument doesn't exist, create a new chats with this data.
     */
    create: XOR<chatsCreateInput, chatsUncheckedCreateInput>
    /**
     * In case the chats was found with the provided `where` argument, update it with this data.
     */
    update: XOR<chatsUpdateInput, chatsUncheckedUpdateInput>
  }

  /**
   * chats delete
   */
  export type chatsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
    /**
     * Filter which chats to delete.
     */
    where: chatsWhereUniqueInput
  }

  /**
   * chats deleteMany
   */
  export type chatsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which chats to delete
     */
    where?: chatsWhereInput
    /**
     * Limit how many chats to delete.
     */
    limit?: number
  }

  /**
   * chats.users
   */
  export type chats$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    where?: userWhereInput
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    cursor?: userWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * chats.messages
   */
  export type chats$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    where?: messagesWhereInput
    orderBy?: messagesOrderByWithRelationInput | messagesOrderByWithRelationInput[]
    cursor?: messagesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessagesScalarFieldEnum | MessagesScalarFieldEnum[]
  }

  /**
   * chats without action
   */
  export type chatsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
  }


  /**
   * Model user
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    userId: number | null
    linkId: number | null
  }

  export type UserSumAggregateOutputType = {
    userId: number | null
    linkId: number | null
  }

  export type UserMinAggregateOutputType = {
    userId: number | null
    linkId: number | null
    username: string | null
  }

  export type UserMaxAggregateOutputType = {
    userId: number | null
    linkId: number | null
    username: string | null
  }

  export type UserCountAggregateOutputType = {
    userId: number
    linkId: number
    username: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    userId?: true
    linkId?: true
  }

  export type UserSumAggregateInputType = {
    userId?: true
    linkId?: true
  }

  export type UserMinAggregateInputType = {
    userId?: true
    linkId?: true
    username?: true
  }

  export type UserMaxAggregateInputType = {
    userId?: true
    linkId?: true
    username?: true
  }

  export type UserCountAggregateInputType = {
    userId?: true
    linkId?: true
    username?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user to aggregate.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
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




  export type userGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: userWhereInput
    orderBy?: userOrderByWithAggregationInput | userOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: userScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    userId: number
    linkId: number
    username: string
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends userGroupByArgs> = Prisma.PrismaPromise<
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


  export type userSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    linkId?: boolean
    username?: boolean
    messages?: boolean | user$messagesArgs<ExtArgs>
    chatHost?: boolean | user$chatHostArgs<ExtArgs>
    members?: boolean | user$membersArgs<ExtArgs>
    blockedUsers?: boolean | user$blockedUsersArgs<ExtArgs>
    blockedBy?: boolean | user$blockedByArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type userSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    linkId?: boolean
    username?: boolean
  }, ExtArgs["result"]["user"]>

  export type userSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    linkId?: boolean
    username?: boolean
  }, ExtArgs["result"]["user"]>

  export type userSelectScalar = {
    userId?: boolean
    linkId?: boolean
    username?: boolean
  }

  export type userOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "linkId" | "username", ExtArgs["result"]["user"]>
  export type userInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | user$messagesArgs<ExtArgs>
    chatHost?: boolean | user$chatHostArgs<ExtArgs>
    members?: boolean | user$membersArgs<ExtArgs>
    blockedUsers?: boolean | user$blockedUsersArgs<ExtArgs>
    blockedBy?: boolean | user$blockedByArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type userIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type userIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $userPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user"
    objects: {
      messages: Prisma.$messagesPayload<ExtArgs>[]
      chatHost: Prisma.$chatsPayload<ExtArgs>[]
      members: Prisma.$chatsPayload<ExtArgs>[]
      blockedUsers: Prisma.$userPayload<ExtArgs>[]
      blockedBy: Prisma.$userPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: number
      linkId: number
      username: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type userGetPayload<S extends boolean | null | undefined | userDefaultArgs> = $Result.GetResult<Prisma.$userPayload, S>

  type userCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<userFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface userDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user'], meta: { name: 'user' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {userFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends userFindUniqueArgs>(args: SelectSubset<T, userFindUniqueArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {userFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends userFindUniqueOrThrowArgs>(args: SelectSubset<T, userFindUniqueOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends userFindFirstArgs>(args?: SelectSubset<T, userFindFirstArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends userFindFirstOrThrowArgs>(args?: SelectSubset<T, userFindFirstOrThrowArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const userWithUserIdOnly = await prisma.user.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends userFindManyArgs>(args?: SelectSubset<T, userFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {userCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends userCreateArgs>(args: SelectSubset<T, userCreateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {userCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends userCreateManyArgs>(args?: SelectSubset<T, userCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {userCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `userId`
     * const userWithUserIdOnly = await prisma.user.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends userCreateManyAndReturnArgs>(args?: SelectSubset<T, userCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {userDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends userDeleteArgs>(args: SelectSubset<T, userDeleteArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {userUpdateArgs} args - Arguments to update one User.
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
    update<T extends userUpdateArgs>(args: SelectSubset<T, userUpdateArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {userDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends userDeleteManyArgs>(args?: SelectSubset<T, userDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userUpdateManyArgs} args - Arguments to update one or more rows.
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
    updateMany<T extends userUpdateManyArgs>(args: SelectSubset<T, userUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {userUpdateManyAndReturnArgs} args - Arguments to update many Users.
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
     * // Update zero or more Users and only return the `userId`
     * const userWithUserIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { userId: true },
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
    updateManyAndReturn<T extends userUpdateManyAndReturnArgs>(args: SelectSubset<T, userUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {userUpsertArgs} args - Arguments to update or create a User.
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
    upsert<T extends userUpsertArgs>(args: SelectSubset<T, userUpsertArgs<ExtArgs>>): Prisma__userClient<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends userCountArgs>(
      args?: Subset<T, userCountArgs>,
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
     * @param {userGroupByArgs} args - Group by arguments.
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
      T extends userGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: userGroupByArgs['orderBy'] }
        : { orderBy?: userGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, userGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user model
   */
  readonly fields: userFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__userClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages<T extends user$messagesArgs<ExtArgs> = {}>(args?: Subset<T, user$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$messagesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chatHost<T extends user$chatHostArgs<ExtArgs> = {}>(args?: Subset<T, user$chatHostArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    members<T extends user$membersArgs<ExtArgs> = {}>(args?: Subset<T, user$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    blockedUsers<T extends user$blockedUsersArgs<ExtArgs> = {}>(args?: Subset<T, user$blockedUsersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    blockedBy<T extends user$blockedByArgs<ExtArgs> = {}>(args?: Subset<T, user$blockedByArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$userPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the user model
   */
  interface userFieldRefs {
    readonly userId: FieldRef<"user", 'Int'>
    readonly linkId: FieldRef<"user", 'Int'>
    readonly username: FieldRef<"user", 'String'>
  }
    

  // Custom InputTypes
  /**
   * user findUnique
   */
  export type userFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findUniqueOrThrow
   */
  export type userFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where: userWhereUniqueInput
  }

  /**
   * user findFirst
   */
  export type userFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findFirstOrThrow
   */
  export type userFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which user to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user findMany
   */
  export type userFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user create
   */
  export type userCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to create a user.
     */
    data: XOR<userCreateInput, userUncheckedCreateInput>
  }

  /**
   * user createMany
   */
  export type userCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
  }

  /**
   * user createManyAndReturn
   */
  export type userCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: userCreateManyInput | userCreateManyInput[]
  }

  /**
   * user update
   */
  export type userUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The data needed to update a user.
     */
    data: XOR<userUpdateInput, userUncheckedUpdateInput>
    /**
     * Choose, which user to update.
     */
    where: userWhereUniqueInput
  }

  /**
   * user updateMany
   */
  export type userUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user updateManyAndReturn
   */
  export type userUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: userWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * user upsert
   */
  export type userUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * The filter to search for the user to update in case it exists.
     */
    where: userWhereUniqueInput
    /**
     * In case the user found by the `where` argument doesn't exist, create a new user with this data.
     */
    create: XOR<userCreateInput, userUncheckedCreateInput>
    /**
     * In case the user was found with the provided `where` argument, update it with this data.
     */
    update: XOR<userUpdateInput, userUncheckedUpdateInput>
  }

  /**
   * user delete
   */
  export type userDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    /**
     * Filter which user to delete.
     */
    where: userWhereUniqueInput
  }

  /**
   * user deleteMany
   */
  export type userDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: userWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * user.messages
   */
  export type user$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the messages
     */
    omit?: messagesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: messagesInclude<ExtArgs> | null
    where?: messagesWhereInput
    orderBy?: messagesOrderByWithRelationInput | messagesOrderByWithRelationInput[]
    cursor?: messagesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessagesScalarFieldEnum | MessagesScalarFieldEnum[]
  }

  /**
   * user.chatHost
   */
  export type user$chatHostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
    where?: chatsWhereInput
    orderBy?: chatsOrderByWithRelationInput | chatsOrderByWithRelationInput[]
    cursor?: chatsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatsScalarFieldEnum | ChatsScalarFieldEnum[]
  }

  /**
   * user.members
   */
  export type user$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chats
     */
    select?: chatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the chats
     */
    omit?: chatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chatsInclude<ExtArgs> | null
    where?: chatsWhereInput
    orderBy?: chatsOrderByWithRelationInput | chatsOrderByWithRelationInput[]
    cursor?: chatsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatsScalarFieldEnum | ChatsScalarFieldEnum[]
  }

  /**
   * user.blockedUsers
   */
  export type user$blockedUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    where?: userWhereInput
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    cursor?: userWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user.blockedBy
   */
  export type user$blockedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
    where?: userWhereInput
    orderBy?: userOrderByWithRelationInput | userOrderByWithRelationInput[]
    cursor?: userWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * user without action
   */
  export type userDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user
     */
    select?: userSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user
     */
    omit?: userOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: userInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const MessagesScalarFieldEnum: {
    id: 'id',
    chatId: 'chatId',
    userId: 'userId',
    message: 'message',
    date: 'date'
  };

  export type MessagesScalarFieldEnum = (typeof MessagesScalarFieldEnum)[keyof typeof MessagesScalarFieldEnum]


  export const ChatsScalarFieldEnum: {
    chatId: 'chatId',
    hostId: 'hostId',
    name: 'name',
    lastAccessed: 'lastAccessed'
  };

  export type ChatsScalarFieldEnum = (typeof ChatsScalarFieldEnum)[keyof typeof ChatsScalarFieldEnum]


  export const UserScalarFieldEnum: {
    userId: 'userId',
    linkId: 'linkId',
    username: 'username'
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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type messagesWhereInput = {
    AND?: messagesWhereInput | messagesWhereInput[]
    OR?: messagesWhereInput[]
    NOT?: messagesWhereInput | messagesWhereInput[]
    id?: IntFilter<"messages"> | number
    chatId?: IntFilter<"messages"> | number
    userId?: IntFilter<"messages"> | number
    message?: StringFilter<"messages"> | string
    date?: DateTimeFilter<"messages"> | Date | string
    chat?: XOR<ChatsScalarRelationFilter, chatsWhereInput>
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }

  export type messagesOrderByWithRelationInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    date?: SortOrder
    chat?: chatsOrderByWithRelationInput
    user?: userOrderByWithRelationInput
  }

  export type messagesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    chatId?: number
    userId?: number
    AND?: messagesWhereInput | messagesWhereInput[]
    OR?: messagesWhereInput[]
    NOT?: messagesWhereInput | messagesWhereInput[]
    message?: StringFilter<"messages"> | string
    date?: DateTimeFilter<"messages"> | Date | string
    chat?: XOR<ChatsScalarRelationFilter, chatsWhereInput>
    user?: XOR<UserScalarRelationFilter, userWhereInput>
  }, "id" | "chatId" | "userId">

  export type messagesOrderByWithAggregationInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    date?: SortOrder
    _count?: messagesCountOrderByAggregateInput
    _avg?: messagesAvgOrderByAggregateInput
    _max?: messagesMaxOrderByAggregateInput
    _min?: messagesMinOrderByAggregateInput
    _sum?: messagesSumOrderByAggregateInput
  }

  export type messagesScalarWhereWithAggregatesInput = {
    AND?: messagesScalarWhereWithAggregatesInput | messagesScalarWhereWithAggregatesInput[]
    OR?: messagesScalarWhereWithAggregatesInput[]
    NOT?: messagesScalarWhereWithAggregatesInput | messagesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"messages"> | number
    chatId?: IntWithAggregatesFilter<"messages"> | number
    userId?: IntWithAggregatesFilter<"messages"> | number
    message?: StringWithAggregatesFilter<"messages"> | string
    date?: DateTimeWithAggregatesFilter<"messages"> | Date | string
  }

  export type chatsWhereInput = {
    AND?: chatsWhereInput | chatsWhereInput[]
    OR?: chatsWhereInput[]
    NOT?: chatsWhereInput | chatsWhereInput[]
    chatId?: IntFilter<"chats"> | number
    hostId?: IntFilter<"chats"> | number
    name?: StringFilter<"chats"> | string
    lastAccessed?: DateTimeNullableFilter<"chats"> | Date | string | null
    host?: XOR<UserScalarRelationFilter, userWhereInput>
    users?: UserListRelationFilter
    messages?: MessagesListRelationFilter
  }

  export type chatsOrderByWithRelationInput = {
    chatId?: SortOrder
    hostId?: SortOrder
    name?: SortOrder
    lastAccessed?: SortOrderInput | SortOrder
    host?: userOrderByWithRelationInput
    users?: userOrderByRelationAggregateInput
    messages?: messagesOrderByRelationAggregateInput
  }

  export type chatsWhereUniqueInput = Prisma.AtLeast<{
    chatId?: number
    AND?: chatsWhereInput | chatsWhereInput[]
    OR?: chatsWhereInput[]
    NOT?: chatsWhereInput | chatsWhereInput[]
    hostId?: IntFilter<"chats"> | number
    name?: StringFilter<"chats"> | string
    lastAccessed?: DateTimeNullableFilter<"chats"> | Date | string | null
    host?: XOR<UserScalarRelationFilter, userWhereInput>
    users?: UserListRelationFilter
    messages?: MessagesListRelationFilter
  }, "chatId">

  export type chatsOrderByWithAggregationInput = {
    chatId?: SortOrder
    hostId?: SortOrder
    name?: SortOrder
    lastAccessed?: SortOrderInput | SortOrder
    _count?: chatsCountOrderByAggregateInput
    _avg?: chatsAvgOrderByAggregateInput
    _max?: chatsMaxOrderByAggregateInput
    _min?: chatsMinOrderByAggregateInput
    _sum?: chatsSumOrderByAggregateInput
  }

  export type chatsScalarWhereWithAggregatesInput = {
    AND?: chatsScalarWhereWithAggregatesInput | chatsScalarWhereWithAggregatesInput[]
    OR?: chatsScalarWhereWithAggregatesInput[]
    NOT?: chatsScalarWhereWithAggregatesInput | chatsScalarWhereWithAggregatesInput[]
    chatId?: IntWithAggregatesFilter<"chats"> | number
    hostId?: IntWithAggregatesFilter<"chats"> | number
    name?: StringWithAggregatesFilter<"chats"> | string
    lastAccessed?: DateTimeNullableWithAggregatesFilter<"chats"> | Date | string | null
  }

  export type userWhereInput = {
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    userId?: IntFilter<"user"> | number
    linkId?: IntFilter<"user"> | number
    username?: StringFilter<"user"> | string
    messages?: MessagesListRelationFilter
    chatHost?: ChatsListRelationFilter
    members?: ChatsListRelationFilter
    blockedUsers?: UserListRelationFilter
    blockedBy?: UserListRelationFilter
  }

  export type userOrderByWithRelationInput = {
    userId?: SortOrder
    linkId?: SortOrder
    username?: SortOrder
    messages?: messagesOrderByRelationAggregateInput
    chatHost?: chatsOrderByRelationAggregateInput
    members?: chatsOrderByRelationAggregateInput
    blockedUsers?: userOrderByRelationAggregateInput
    blockedBy?: userOrderByRelationAggregateInput
  }

  export type userWhereUniqueInput = Prisma.AtLeast<{
    userId?: number
    linkId?: number
    username?: string
    AND?: userWhereInput | userWhereInput[]
    OR?: userWhereInput[]
    NOT?: userWhereInput | userWhereInput[]
    messages?: MessagesListRelationFilter
    chatHost?: ChatsListRelationFilter
    members?: ChatsListRelationFilter
    blockedUsers?: UserListRelationFilter
    blockedBy?: UserListRelationFilter
  }, "userId" | "linkId" | "username">

  export type userOrderByWithAggregationInput = {
    userId?: SortOrder
    linkId?: SortOrder
    username?: SortOrder
    _count?: userCountOrderByAggregateInput
    _avg?: userAvgOrderByAggregateInput
    _max?: userMaxOrderByAggregateInput
    _min?: userMinOrderByAggregateInput
    _sum?: userSumOrderByAggregateInput
  }

  export type userScalarWhereWithAggregatesInput = {
    AND?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    OR?: userScalarWhereWithAggregatesInput[]
    NOT?: userScalarWhereWithAggregatesInput | userScalarWhereWithAggregatesInput[]
    userId?: IntWithAggregatesFilter<"user"> | number
    linkId?: IntWithAggregatesFilter<"user"> | number
    username?: StringWithAggregatesFilter<"user"> | string
  }

  export type messagesCreateInput = {
    message: string
    date?: Date | string
    chat: chatsCreateNestedOneWithoutMessagesInput
    user: userCreateNestedOneWithoutMessagesInput
  }

  export type messagesUncheckedCreateInput = {
    id?: number
    chatId: number
    userId: number
    message: string
    date?: Date | string
  }

  export type messagesUpdateInput = {
    message?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    chat?: chatsUpdateOneRequiredWithoutMessagesNestedInput
    user?: userUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type messagesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    chatId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messagesCreateManyInput = {
    id?: number
    chatId: number
    userId: number
    message: string
    date?: Date | string
  }

  export type messagesUpdateManyMutationInput = {
    message?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messagesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    chatId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chatsCreateInput = {
    name: string
    lastAccessed?: Date | string | null
    host: userCreateNestedOneWithoutChatHostInput
    users?: userCreateNestedManyWithoutMembersInput
    messages?: messagesCreateNestedManyWithoutChatInput
  }

  export type chatsUncheckedCreateInput = {
    chatId?: number
    hostId: number
    name: string
    lastAccessed?: Date | string | null
    users?: userUncheckedCreateNestedManyWithoutMembersInput
    messages?: messagesUncheckedCreateNestedManyWithoutChatInput
  }

  export type chatsUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    host?: userUpdateOneRequiredWithoutChatHostNestedInput
    users?: userUpdateManyWithoutMembersNestedInput
    messages?: messagesUpdateManyWithoutChatNestedInput
  }

  export type chatsUncheckedUpdateInput = {
    chatId?: IntFieldUpdateOperationsInput | number
    hostId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: userUncheckedUpdateManyWithoutMembersNestedInput
    messages?: messagesUncheckedUpdateManyWithoutChatNestedInput
  }

  export type chatsCreateManyInput = {
    chatId?: number
    hostId: number
    name: string
    lastAccessed?: Date | string | null
  }

  export type chatsUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type chatsUncheckedUpdateManyInput = {
    chatId?: IntFieldUpdateOperationsInput | number
    hostId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type userCreateInput = {
    linkId: number
    username: string
    messages?: messagesCreateNestedManyWithoutUserInput
    chatHost?: chatsCreateNestedManyWithoutHostInput
    members?: chatsCreateNestedManyWithoutUsersInput
    blockedUsers?: userCreateNestedManyWithoutBlockedByInput
    blockedBy?: userCreateNestedManyWithoutBlockedUsersInput
  }

  export type userUncheckedCreateInput = {
    userId?: number
    linkId: number
    username: string
    messages?: messagesUncheckedCreateNestedManyWithoutUserInput
    chatHost?: chatsUncheckedCreateNestedManyWithoutHostInput
    members?: chatsUncheckedCreateNestedManyWithoutUsersInput
    blockedUsers?: userUncheckedCreateNestedManyWithoutBlockedByInput
    blockedBy?: userUncheckedCreateNestedManyWithoutBlockedUsersInput
  }

  export type userUpdateInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    messages?: messagesUpdateManyWithoutUserNestedInput
    chatHost?: chatsUpdateManyWithoutHostNestedInput
    members?: chatsUpdateManyWithoutUsersNestedInput
    blockedUsers?: userUpdateManyWithoutBlockedByNestedInput
    blockedBy?: userUpdateManyWithoutBlockedUsersNestedInput
  }

  export type userUncheckedUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    messages?: messagesUncheckedUpdateManyWithoutUserNestedInput
    chatHost?: chatsUncheckedUpdateManyWithoutHostNestedInput
    members?: chatsUncheckedUpdateManyWithoutUsersNestedInput
    blockedUsers?: userUncheckedUpdateManyWithoutBlockedByNestedInput
    blockedBy?: userUncheckedUpdateManyWithoutBlockedUsersNestedInput
  }

  export type userCreateManyInput = {
    userId?: number
    linkId: number
    username: string
  }

  export type userUpdateManyMutationInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
  }

  export type userUncheckedUpdateManyInput = {
    userId?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ChatsScalarRelationFilter = {
    is?: chatsWhereInput
    isNot?: chatsWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: userWhereInput
    isNot?: userWhereInput
  }

  export type messagesCountOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    date?: SortOrder
  }

  export type messagesAvgOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
  }

  export type messagesMaxOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    date?: SortOrder
  }

  export type messagesMinOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    date?: SortOrder
  }

  export type messagesSumOrderByAggregateInput = {
    id?: SortOrder
    chatId?: SortOrder
    userId?: SortOrder
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

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserListRelationFilter = {
    every?: userWhereInput
    some?: userWhereInput
    none?: userWhereInput
  }

  export type MessagesListRelationFilter = {
    every?: messagesWhereInput
    some?: messagesWhereInput
    none?: messagesWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type userOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type messagesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type chatsCountOrderByAggregateInput = {
    chatId?: SortOrder
    hostId?: SortOrder
    name?: SortOrder
    lastAccessed?: SortOrder
  }

  export type chatsAvgOrderByAggregateInput = {
    chatId?: SortOrder
    hostId?: SortOrder
  }

  export type chatsMaxOrderByAggregateInput = {
    chatId?: SortOrder
    hostId?: SortOrder
    name?: SortOrder
    lastAccessed?: SortOrder
  }

  export type chatsMinOrderByAggregateInput = {
    chatId?: SortOrder
    hostId?: SortOrder
    name?: SortOrder
    lastAccessed?: SortOrder
  }

  export type chatsSumOrderByAggregateInput = {
    chatId?: SortOrder
    hostId?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ChatsListRelationFilter = {
    every?: chatsWhereInput
    some?: chatsWhereInput
    none?: chatsWhereInput
  }

  export type chatsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type userCountOrderByAggregateInput = {
    userId?: SortOrder
    linkId?: SortOrder
    username?: SortOrder
  }

  export type userAvgOrderByAggregateInput = {
    userId?: SortOrder
    linkId?: SortOrder
  }

  export type userMaxOrderByAggregateInput = {
    userId?: SortOrder
    linkId?: SortOrder
    username?: SortOrder
  }

  export type userMinOrderByAggregateInput = {
    userId?: SortOrder
    linkId?: SortOrder
    username?: SortOrder
  }

  export type userSumOrderByAggregateInput = {
    userId?: SortOrder
    linkId?: SortOrder
  }

  export type chatsCreateNestedOneWithoutMessagesInput = {
    create?: XOR<chatsCreateWithoutMessagesInput, chatsUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: chatsCreateOrConnectWithoutMessagesInput
    connect?: chatsWhereUniqueInput
  }

  export type userCreateNestedOneWithoutMessagesInput = {
    create?: XOR<userCreateWithoutMessagesInput, userUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: userCreateOrConnectWithoutMessagesInput
    connect?: userWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type chatsUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<chatsCreateWithoutMessagesInput, chatsUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: chatsCreateOrConnectWithoutMessagesInput
    upsert?: chatsUpsertWithoutMessagesInput
    connect?: chatsWhereUniqueInput
    update?: XOR<XOR<chatsUpdateToOneWithWhereWithoutMessagesInput, chatsUpdateWithoutMessagesInput>, chatsUncheckedUpdateWithoutMessagesInput>
  }

  export type userUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<userCreateWithoutMessagesInput, userUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: userCreateOrConnectWithoutMessagesInput
    upsert?: userUpsertWithoutMessagesInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutMessagesInput, userUpdateWithoutMessagesInput>, userUncheckedUpdateWithoutMessagesInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type userCreateNestedOneWithoutChatHostInput = {
    create?: XOR<userCreateWithoutChatHostInput, userUncheckedCreateWithoutChatHostInput>
    connectOrCreate?: userCreateOrConnectWithoutChatHostInput
    connect?: userWhereUniqueInput
  }

  export type userCreateNestedManyWithoutMembersInput = {
    create?: XOR<userCreateWithoutMembersInput, userUncheckedCreateWithoutMembersInput> | userCreateWithoutMembersInput[] | userUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: userCreateOrConnectWithoutMembersInput | userCreateOrConnectWithoutMembersInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
  }

  export type messagesCreateNestedManyWithoutChatInput = {
    create?: XOR<messagesCreateWithoutChatInput, messagesUncheckedCreateWithoutChatInput> | messagesCreateWithoutChatInput[] | messagesUncheckedCreateWithoutChatInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutChatInput | messagesCreateOrConnectWithoutChatInput[]
    createMany?: messagesCreateManyChatInputEnvelope
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
  }

  export type userUncheckedCreateNestedManyWithoutMembersInput = {
    create?: XOR<userCreateWithoutMembersInput, userUncheckedCreateWithoutMembersInput> | userCreateWithoutMembersInput[] | userUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: userCreateOrConnectWithoutMembersInput | userCreateOrConnectWithoutMembersInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
  }

  export type messagesUncheckedCreateNestedManyWithoutChatInput = {
    create?: XOR<messagesCreateWithoutChatInput, messagesUncheckedCreateWithoutChatInput> | messagesCreateWithoutChatInput[] | messagesUncheckedCreateWithoutChatInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutChatInput | messagesCreateOrConnectWithoutChatInput[]
    createMany?: messagesCreateManyChatInputEnvelope
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type userUpdateOneRequiredWithoutChatHostNestedInput = {
    create?: XOR<userCreateWithoutChatHostInput, userUncheckedCreateWithoutChatHostInput>
    connectOrCreate?: userCreateOrConnectWithoutChatHostInput
    upsert?: userUpsertWithoutChatHostInput
    connect?: userWhereUniqueInput
    update?: XOR<XOR<userUpdateToOneWithWhereWithoutChatHostInput, userUpdateWithoutChatHostInput>, userUncheckedUpdateWithoutChatHostInput>
  }

  export type userUpdateManyWithoutMembersNestedInput = {
    create?: XOR<userCreateWithoutMembersInput, userUncheckedCreateWithoutMembersInput> | userCreateWithoutMembersInput[] | userUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: userCreateOrConnectWithoutMembersInput | userCreateOrConnectWithoutMembersInput[]
    upsert?: userUpsertWithWhereUniqueWithoutMembersInput | userUpsertWithWhereUniqueWithoutMembersInput[]
    set?: userWhereUniqueInput | userWhereUniqueInput[]
    disconnect?: userWhereUniqueInput | userWhereUniqueInput[]
    delete?: userWhereUniqueInput | userWhereUniqueInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
    update?: userUpdateWithWhereUniqueWithoutMembersInput | userUpdateWithWhereUniqueWithoutMembersInput[]
    updateMany?: userUpdateManyWithWhereWithoutMembersInput | userUpdateManyWithWhereWithoutMembersInput[]
    deleteMany?: userScalarWhereInput | userScalarWhereInput[]
  }

  export type messagesUpdateManyWithoutChatNestedInput = {
    create?: XOR<messagesCreateWithoutChatInput, messagesUncheckedCreateWithoutChatInput> | messagesCreateWithoutChatInput[] | messagesUncheckedCreateWithoutChatInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutChatInput | messagesCreateOrConnectWithoutChatInput[]
    upsert?: messagesUpsertWithWhereUniqueWithoutChatInput | messagesUpsertWithWhereUniqueWithoutChatInput[]
    createMany?: messagesCreateManyChatInputEnvelope
    set?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    disconnect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    delete?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    update?: messagesUpdateWithWhereUniqueWithoutChatInput | messagesUpdateWithWhereUniqueWithoutChatInput[]
    updateMany?: messagesUpdateManyWithWhereWithoutChatInput | messagesUpdateManyWithWhereWithoutChatInput[]
    deleteMany?: messagesScalarWhereInput | messagesScalarWhereInput[]
  }

  export type userUncheckedUpdateManyWithoutMembersNestedInput = {
    create?: XOR<userCreateWithoutMembersInput, userUncheckedCreateWithoutMembersInput> | userCreateWithoutMembersInput[] | userUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: userCreateOrConnectWithoutMembersInput | userCreateOrConnectWithoutMembersInput[]
    upsert?: userUpsertWithWhereUniqueWithoutMembersInput | userUpsertWithWhereUniqueWithoutMembersInput[]
    set?: userWhereUniqueInput | userWhereUniqueInput[]
    disconnect?: userWhereUniqueInput | userWhereUniqueInput[]
    delete?: userWhereUniqueInput | userWhereUniqueInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
    update?: userUpdateWithWhereUniqueWithoutMembersInput | userUpdateWithWhereUniqueWithoutMembersInput[]
    updateMany?: userUpdateManyWithWhereWithoutMembersInput | userUpdateManyWithWhereWithoutMembersInput[]
    deleteMany?: userScalarWhereInput | userScalarWhereInput[]
  }

  export type messagesUncheckedUpdateManyWithoutChatNestedInput = {
    create?: XOR<messagesCreateWithoutChatInput, messagesUncheckedCreateWithoutChatInput> | messagesCreateWithoutChatInput[] | messagesUncheckedCreateWithoutChatInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutChatInput | messagesCreateOrConnectWithoutChatInput[]
    upsert?: messagesUpsertWithWhereUniqueWithoutChatInput | messagesUpsertWithWhereUniqueWithoutChatInput[]
    createMany?: messagesCreateManyChatInputEnvelope
    set?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    disconnect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    delete?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    update?: messagesUpdateWithWhereUniqueWithoutChatInput | messagesUpdateWithWhereUniqueWithoutChatInput[]
    updateMany?: messagesUpdateManyWithWhereWithoutChatInput | messagesUpdateManyWithWhereWithoutChatInput[]
    deleteMany?: messagesScalarWhereInput | messagesScalarWhereInput[]
  }

  export type messagesCreateNestedManyWithoutUserInput = {
    create?: XOR<messagesCreateWithoutUserInput, messagesUncheckedCreateWithoutUserInput> | messagesCreateWithoutUserInput[] | messagesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutUserInput | messagesCreateOrConnectWithoutUserInput[]
    createMany?: messagesCreateManyUserInputEnvelope
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
  }

  export type chatsCreateNestedManyWithoutHostInput = {
    create?: XOR<chatsCreateWithoutHostInput, chatsUncheckedCreateWithoutHostInput> | chatsCreateWithoutHostInput[] | chatsUncheckedCreateWithoutHostInput[]
    connectOrCreate?: chatsCreateOrConnectWithoutHostInput | chatsCreateOrConnectWithoutHostInput[]
    createMany?: chatsCreateManyHostInputEnvelope
    connect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
  }

  export type chatsCreateNestedManyWithoutUsersInput = {
    create?: XOR<chatsCreateWithoutUsersInput, chatsUncheckedCreateWithoutUsersInput> | chatsCreateWithoutUsersInput[] | chatsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: chatsCreateOrConnectWithoutUsersInput | chatsCreateOrConnectWithoutUsersInput[]
    connect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
  }

  export type userCreateNestedManyWithoutBlockedByInput = {
    create?: XOR<userCreateWithoutBlockedByInput, userUncheckedCreateWithoutBlockedByInput> | userCreateWithoutBlockedByInput[] | userUncheckedCreateWithoutBlockedByInput[]
    connectOrCreate?: userCreateOrConnectWithoutBlockedByInput | userCreateOrConnectWithoutBlockedByInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
  }

  export type userCreateNestedManyWithoutBlockedUsersInput = {
    create?: XOR<userCreateWithoutBlockedUsersInput, userUncheckedCreateWithoutBlockedUsersInput> | userCreateWithoutBlockedUsersInput[] | userUncheckedCreateWithoutBlockedUsersInput[]
    connectOrCreate?: userCreateOrConnectWithoutBlockedUsersInput | userCreateOrConnectWithoutBlockedUsersInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
  }

  export type messagesUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<messagesCreateWithoutUserInput, messagesUncheckedCreateWithoutUserInput> | messagesCreateWithoutUserInput[] | messagesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutUserInput | messagesCreateOrConnectWithoutUserInput[]
    createMany?: messagesCreateManyUserInputEnvelope
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
  }

  export type chatsUncheckedCreateNestedManyWithoutHostInput = {
    create?: XOR<chatsCreateWithoutHostInput, chatsUncheckedCreateWithoutHostInput> | chatsCreateWithoutHostInput[] | chatsUncheckedCreateWithoutHostInput[]
    connectOrCreate?: chatsCreateOrConnectWithoutHostInput | chatsCreateOrConnectWithoutHostInput[]
    createMany?: chatsCreateManyHostInputEnvelope
    connect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
  }

  export type chatsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<chatsCreateWithoutUsersInput, chatsUncheckedCreateWithoutUsersInput> | chatsCreateWithoutUsersInput[] | chatsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: chatsCreateOrConnectWithoutUsersInput | chatsCreateOrConnectWithoutUsersInput[]
    connect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
  }

  export type userUncheckedCreateNestedManyWithoutBlockedByInput = {
    create?: XOR<userCreateWithoutBlockedByInput, userUncheckedCreateWithoutBlockedByInput> | userCreateWithoutBlockedByInput[] | userUncheckedCreateWithoutBlockedByInput[]
    connectOrCreate?: userCreateOrConnectWithoutBlockedByInput | userCreateOrConnectWithoutBlockedByInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
  }

  export type userUncheckedCreateNestedManyWithoutBlockedUsersInput = {
    create?: XOR<userCreateWithoutBlockedUsersInput, userUncheckedCreateWithoutBlockedUsersInput> | userCreateWithoutBlockedUsersInput[] | userUncheckedCreateWithoutBlockedUsersInput[]
    connectOrCreate?: userCreateOrConnectWithoutBlockedUsersInput | userCreateOrConnectWithoutBlockedUsersInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
  }

  export type messagesUpdateManyWithoutUserNestedInput = {
    create?: XOR<messagesCreateWithoutUserInput, messagesUncheckedCreateWithoutUserInput> | messagesCreateWithoutUserInput[] | messagesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutUserInput | messagesCreateOrConnectWithoutUserInput[]
    upsert?: messagesUpsertWithWhereUniqueWithoutUserInput | messagesUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: messagesCreateManyUserInputEnvelope
    set?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    disconnect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    delete?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    update?: messagesUpdateWithWhereUniqueWithoutUserInput | messagesUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: messagesUpdateManyWithWhereWithoutUserInput | messagesUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: messagesScalarWhereInput | messagesScalarWhereInput[]
  }

  export type chatsUpdateManyWithoutHostNestedInput = {
    create?: XOR<chatsCreateWithoutHostInput, chatsUncheckedCreateWithoutHostInput> | chatsCreateWithoutHostInput[] | chatsUncheckedCreateWithoutHostInput[]
    connectOrCreate?: chatsCreateOrConnectWithoutHostInput | chatsCreateOrConnectWithoutHostInput[]
    upsert?: chatsUpsertWithWhereUniqueWithoutHostInput | chatsUpsertWithWhereUniqueWithoutHostInput[]
    createMany?: chatsCreateManyHostInputEnvelope
    set?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    disconnect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    delete?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    connect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    update?: chatsUpdateWithWhereUniqueWithoutHostInput | chatsUpdateWithWhereUniqueWithoutHostInput[]
    updateMany?: chatsUpdateManyWithWhereWithoutHostInput | chatsUpdateManyWithWhereWithoutHostInput[]
    deleteMany?: chatsScalarWhereInput | chatsScalarWhereInput[]
  }

  export type chatsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<chatsCreateWithoutUsersInput, chatsUncheckedCreateWithoutUsersInput> | chatsCreateWithoutUsersInput[] | chatsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: chatsCreateOrConnectWithoutUsersInput | chatsCreateOrConnectWithoutUsersInput[]
    upsert?: chatsUpsertWithWhereUniqueWithoutUsersInput | chatsUpsertWithWhereUniqueWithoutUsersInput[]
    set?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    disconnect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    delete?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    connect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    update?: chatsUpdateWithWhereUniqueWithoutUsersInput | chatsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: chatsUpdateManyWithWhereWithoutUsersInput | chatsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: chatsScalarWhereInput | chatsScalarWhereInput[]
  }

  export type userUpdateManyWithoutBlockedByNestedInput = {
    create?: XOR<userCreateWithoutBlockedByInput, userUncheckedCreateWithoutBlockedByInput> | userCreateWithoutBlockedByInput[] | userUncheckedCreateWithoutBlockedByInput[]
    connectOrCreate?: userCreateOrConnectWithoutBlockedByInput | userCreateOrConnectWithoutBlockedByInput[]
    upsert?: userUpsertWithWhereUniqueWithoutBlockedByInput | userUpsertWithWhereUniqueWithoutBlockedByInput[]
    set?: userWhereUniqueInput | userWhereUniqueInput[]
    disconnect?: userWhereUniqueInput | userWhereUniqueInput[]
    delete?: userWhereUniqueInput | userWhereUniqueInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
    update?: userUpdateWithWhereUniqueWithoutBlockedByInput | userUpdateWithWhereUniqueWithoutBlockedByInput[]
    updateMany?: userUpdateManyWithWhereWithoutBlockedByInput | userUpdateManyWithWhereWithoutBlockedByInput[]
    deleteMany?: userScalarWhereInput | userScalarWhereInput[]
  }

  export type userUpdateManyWithoutBlockedUsersNestedInput = {
    create?: XOR<userCreateWithoutBlockedUsersInput, userUncheckedCreateWithoutBlockedUsersInput> | userCreateWithoutBlockedUsersInput[] | userUncheckedCreateWithoutBlockedUsersInput[]
    connectOrCreate?: userCreateOrConnectWithoutBlockedUsersInput | userCreateOrConnectWithoutBlockedUsersInput[]
    upsert?: userUpsertWithWhereUniqueWithoutBlockedUsersInput | userUpsertWithWhereUniqueWithoutBlockedUsersInput[]
    set?: userWhereUniqueInput | userWhereUniqueInput[]
    disconnect?: userWhereUniqueInput | userWhereUniqueInput[]
    delete?: userWhereUniqueInput | userWhereUniqueInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
    update?: userUpdateWithWhereUniqueWithoutBlockedUsersInput | userUpdateWithWhereUniqueWithoutBlockedUsersInput[]
    updateMany?: userUpdateManyWithWhereWithoutBlockedUsersInput | userUpdateManyWithWhereWithoutBlockedUsersInput[]
    deleteMany?: userScalarWhereInput | userScalarWhereInput[]
  }

  export type messagesUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<messagesCreateWithoutUserInput, messagesUncheckedCreateWithoutUserInput> | messagesCreateWithoutUserInput[] | messagesUncheckedCreateWithoutUserInput[]
    connectOrCreate?: messagesCreateOrConnectWithoutUserInput | messagesCreateOrConnectWithoutUserInput[]
    upsert?: messagesUpsertWithWhereUniqueWithoutUserInput | messagesUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: messagesCreateManyUserInputEnvelope
    set?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    disconnect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    delete?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    connect?: messagesWhereUniqueInput | messagesWhereUniqueInput[]
    update?: messagesUpdateWithWhereUniqueWithoutUserInput | messagesUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: messagesUpdateManyWithWhereWithoutUserInput | messagesUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: messagesScalarWhereInput | messagesScalarWhereInput[]
  }

  export type chatsUncheckedUpdateManyWithoutHostNestedInput = {
    create?: XOR<chatsCreateWithoutHostInput, chatsUncheckedCreateWithoutHostInput> | chatsCreateWithoutHostInput[] | chatsUncheckedCreateWithoutHostInput[]
    connectOrCreate?: chatsCreateOrConnectWithoutHostInput | chatsCreateOrConnectWithoutHostInput[]
    upsert?: chatsUpsertWithWhereUniqueWithoutHostInput | chatsUpsertWithWhereUniqueWithoutHostInput[]
    createMany?: chatsCreateManyHostInputEnvelope
    set?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    disconnect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    delete?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    connect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    update?: chatsUpdateWithWhereUniqueWithoutHostInput | chatsUpdateWithWhereUniqueWithoutHostInput[]
    updateMany?: chatsUpdateManyWithWhereWithoutHostInput | chatsUpdateManyWithWhereWithoutHostInput[]
    deleteMany?: chatsScalarWhereInput | chatsScalarWhereInput[]
  }

  export type chatsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<chatsCreateWithoutUsersInput, chatsUncheckedCreateWithoutUsersInput> | chatsCreateWithoutUsersInput[] | chatsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: chatsCreateOrConnectWithoutUsersInput | chatsCreateOrConnectWithoutUsersInput[]
    upsert?: chatsUpsertWithWhereUniqueWithoutUsersInput | chatsUpsertWithWhereUniqueWithoutUsersInput[]
    set?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    disconnect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    delete?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    connect?: chatsWhereUniqueInput | chatsWhereUniqueInput[]
    update?: chatsUpdateWithWhereUniqueWithoutUsersInput | chatsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: chatsUpdateManyWithWhereWithoutUsersInput | chatsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: chatsScalarWhereInput | chatsScalarWhereInput[]
  }

  export type userUncheckedUpdateManyWithoutBlockedByNestedInput = {
    create?: XOR<userCreateWithoutBlockedByInput, userUncheckedCreateWithoutBlockedByInput> | userCreateWithoutBlockedByInput[] | userUncheckedCreateWithoutBlockedByInput[]
    connectOrCreate?: userCreateOrConnectWithoutBlockedByInput | userCreateOrConnectWithoutBlockedByInput[]
    upsert?: userUpsertWithWhereUniqueWithoutBlockedByInput | userUpsertWithWhereUniqueWithoutBlockedByInput[]
    set?: userWhereUniqueInput | userWhereUniqueInput[]
    disconnect?: userWhereUniqueInput | userWhereUniqueInput[]
    delete?: userWhereUniqueInput | userWhereUniqueInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
    update?: userUpdateWithWhereUniqueWithoutBlockedByInput | userUpdateWithWhereUniqueWithoutBlockedByInput[]
    updateMany?: userUpdateManyWithWhereWithoutBlockedByInput | userUpdateManyWithWhereWithoutBlockedByInput[]
    deleteMany?: userScalarWhereInput | userScalarWhereInput[]
  }

  export type userUncheckedUpdateManyWithoutBlockedUsersNestedInput = {
    create?: XOR<userCreateWithoutBlockedUsersInput, userUncheckedCreateWithoutBlockedUsersInput> | userCreateWithoutBlockedUsersInput[] | userUncheckedCreateWithoutBlockedUsersInput[]
    connectOrCreate?: userCreateOrConnectWithoutBlockedUsersInput | userCreateOrConnectWithoutBlockedUsersInput[]
    upsert?: userUpsertWithWhereUniqueWithoutBlockedUsersInput | userUpsertWithWhereUniqueWithoutBlockedUsersInput[]
    set?: userWhereUniqueInput | userWhereUniqueInput[]
    disconnect?: userWhereUniqueInput | userWhereUniqueInput[]
    delete?: userWhereUniqueInput | userWhereUniqueInput[]
    connect?: userWhereUniqueInput | userWhereUniqueInput[]
    update?: userUpdateWithWhereUniqueWithoutBlockedUsersInput | userUpdateWithWhereUniqueWithoutBlockedUsersInput[]
    updateMany?: userUpdateManyWithWhereWithoutBlockedUsersInput | userUpdateManyWithWhereWithoutBlockedUsersInput[]
    deleteMany?: userScalarWhereInput | userScalarWhereInput[]
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

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
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

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
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

  export type chatsCreateWithoutMessagesInput = {
    name: string
    lastAccessed?: Date | string | null
    host: userCreateNestedOneWithoutChatHostInput
    users?: userCreateNestedManyWithoutMembersInput
  }

  export type chatsUncheckedCreateWithoutMessagesInput = {
    chatId?: number
    hostId: number
    name: string
    lastAccessed?: Date | string | null
    users?: userUncheckedCreateNestedManyWithoutMembersInput
  }

  export type chatsCreateOrConnectWithoutMessagesInput = {
    where: chatsWhereUniqueInput
    create: XOR<chatsCreateWithoutMessagesInput, chatsUncheckedCreateWithoutMessagesInput>
  }

  export type userCreateWithoutMessagesInput = {
    linkId: number
    username: string
    chatHost?: chatsCreateNestedManyWithoutHostInput
    members?: chatsCreateNestedManyWithoutUsersInput
    blockedUsers?: userCreateNestedManyWithoutBlockedByInput
    blockedBy?: userCreateNestedManyWithoutBlockedUsersInput
  }

  export type userUncheckedCreateWithoutMessagesInput = {
    userId?: number
    linkId: number
    username: string
    chatHost?: chatsUncheckedCreateNestedManyWithoutHostInput
    members?: chatsUncheckedCreateNestedManyWithoutUsersInput
    blockedUsers?: userUncheckedCreateNestedManyWithoutBlockedByInput
    blockedBy?: userUncheckedCreateNestedManyWithoutBlockedUsersInput
  }

  export type userCreateOrConnectWithoutMessagesInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutMessagesInput, userUncheckedCreateWithoutMessagesInput>
  }

  export type chatsUpsertWithoutMessagesInput = {
    update: XOR<chatsUpdateWithoutMessagesInput, chatsUncheckedUpdateWithoutMessagesInput>
    create: XOR<chatsCreateWithoutMessagesInput, chatsUncheckedCreateWithoutMessagesInput>
    where?: chatsWhereInput
  }

  export type chatsUpdateToOneWithWhereWithoutMessagesInput = {
    where?: chatsWhereInput
    data: XOR<chatsUpdateWithoutMessagesInput, chatsUncheckedUpdateWithoutMessagesInput>
  }

  export type chatsUpdateWithoutMessagesInput = {
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    host?: userUpdateOneRequiredWithoutChatHostNestedInput
    users?: userUpdateManyWithoutMembersNestedInput
  }

  export type chatsUncheckedUpdateWithoutMessagesInput = {
    chatId?: IntFieldUpdateOperationsInput | number
    hostId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: userUncheckedUpdateManyWithoutMembersNestedInput
  }

  export type userUpsertWithoutMessagesInput = {
    update: XOR<userUpdateWithoutMessagesInput, userUncheckedUpdateWithoutMessagesInput>
    create: XOR<userCreateWithoutMessagesInput, userUncheckedCreateWithoutMessagesInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutMessagesInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutMessagesInput, userUncheckedUpdateWithoutMessagesInput>
  }

  export type userUpdateWithoutMessagesInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    chatHost?: chatsUpdateManyWithoutHostNestedInput
    members?: chatsUpdateManyWithoutUsersNestedInput
    blockedUsers?: userUpdateManyWithoutBlockedByNestedInput
    blockedBy?: userUpdateManyWithoutBlockedUsersNestedInput
  }

  export type userUncheckedUpdateWithoutMessagesInput = {
    userId?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    chatHost?: chatsUncheckedUpdateManyWithoutHostNestedInput
    members?: chatsUncheckedUpdateManyWithoutUsersNestedInput
    blockedUsers?: userUncheckedUpdateManyWithoutBlockedByNestedInput
    blockedBy?: userUncheckedUpdateManyWithoutBlockedUsersNestedInput
  }

  export type userCreateWithoutChatHostInput = {
    linkId: number
    username: string
    messages?: messagesCreateNestedManyWithoutUserInput
    members?: chatsCreateNestedManyWithoutUsersInput
    blockedUsers?: userCreateNestedManyWithoutBlockedByInput
    blockedBy?: userCreateNestedManyWithoutBlockedUsersInput
  }

  export type userUncheckedCreateWithoutChatHostInput = {
    userId?: number
    linkId: number
    username: string
    messages?: messagesUncheckedCreateNestedManyWithoutUserInput
    members?: chatsUncheckedCreateNestedManyWithoutUsersInput
    blockedUsers?: userUncheckedCreateNestedManyWithoutBlockedByInput
    blockedBy?: userUncheckedCreateNestedManyWithoutBlockedUsersInput
  }

  export type userCreateOrConnectWithoutChatHostInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutChatHostInput, userUncheckedCreateWithoutChatHostInput>
  }

  export type userCreateWithoutMembersInput = {
    linkId: number
    username: string
    messages?: messagesCreateNestedManyWithoutUserInput
    chatHost?: chatsCreateNestedManyWithoutHostInput
    blockedUsers?: userCreateNestedManyWithoutBlockedByInput
    blockedBy?: userCreateNestedManyWithoutBlockedUsersInput
  }

  export type userUncheckedCreateWithoutMembersInput = {
    userId?: number
    linkId: number
    username: string
    messages?: messagesUncheckedCreateNestedManyWithoutUserInput
    chatHost?: chatsUncheckedCreateNestedManyWithoutHostInput
    blockedUsers?: userUncheckedCreateNestedManyWithoutBlockedByInput
    blockedBy?: userUncheckedCreateNestedManyWithoutBlockedUsersInput
  }

  export type userCreateOrConnectWithoutMembersInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutMembersInput, userUncheckedCreateWithoutMembersInput>
  }

  export type messagesCreateWithoutChatInput = {
    message: string
    date?: Date | string
    user: userCreateNestedOneWithoutMessagesInput
  }

  export type messagesUncheckedCreateWithoutChatInput = {
    id?: number
    userId: number
    message: string
    date?: Date | string
  }

  export type messagesCreateOrConnectWithoutChatInput = {
    where: messagesWhereUniqueInput
    create: XOR<messagesCreateWithoutChatInput, messagesUncheckedCreateWithoutChatInput>
  }

  export type messagesCreateManyChatInputEnvelope = {
    data: messagesCreateManyChatInput | messagesCreateManyChatInput[]
  }

  export type userUpsertWithoutChatHostInput = {
    update: XOR<userUpdateWithoutChatHostInput, userUncheckedUpdateWithoutChatHostInput>
    create: XOR<userCreateWithoutChatHostInput, userUncheckedCreateWithoutChatHostInput>
    where?: userWhereInput
  }

  export type userUpdateToOneWithWhereWithoutChatHostInput = {
    where?: userWhereInput
    data: XOR<userUpdateWithoutChatHostInput, userUncheckedUpdateWithoutChatHostInput>
  }

  export type userUpdateWithoutChatHostInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    messages?: messagesUpdateManyWithoutUserNestedInput
    members?: chatsUpdateManyWithoutUsersNestedInput
    blockedUsers?: userUpdateManyWithoutBlockedByNestedInput
    blockedBy?: userUpdateManyWithoutBlockedUsersNestedInput
  }

  export type userUncheckedUpdateWithoutChatHostInput = {
    userId?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    messages?: messagesUncheckedUpdateManyWithoutUserNestedInput
    members?: chatsUncheckedUpdateManyWithoutUsersNestedInput
    blockedUsers?: userUncheckedUpdateManyWithoutBlockedByNestedInput
    blockedBy?: userUncheckedUpdateManyWithoutBlockedUsersNestedInput
  }

  export type userUpsertWithWhereUniqueWithoutMembersInput = {
    where: userWhereUniqueInput
    update: XOR<userUpdateWithoutMembersInput, userUncheckedUpdateWithoutMembersInput>
    create: XOR<userCreateWithoutMembersInput, userUncheckedCreateWithoutMembersInput>
  }

  export type userUpdateWithWhereUniqueWithoutMembersInput = {
    where: userWhereUniqueInput
    data: XOR<userUpdateWithoutMembersInput, userUncheckedUpdateWithoutMembersInput>
  }

  export type userUpdateManyWithWhereWithoutMembersInput = {
    where: userScalarWhereInput
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyWithoutMembersInput>
  }

  export type userScalarWhereInput = {
    AND?: userScalarWhereInput | userScalarWhereInput[]
    OR?: userScalarWhereInput[]
    NOT?: userScalarWhereInput | userScalarWhereInput[]
    userId?: IntFilter<"user"> | number
    linkId?: IntFilter<"user"> | number
    username?: StringFilter<"user"> | string
  }

  export type messagesUpsertWithWhereUniqueWithoutChatInput = {
    where: messagesWhereUniqueInput
    update: XOR<messagesUpdateWithoutChatInput, messagesUncheckedUpdateWithoutChatInput>
    create: XOR<messagesCreateWithoutChatInput, messagesUncheckedCreateWithoutChatInput>
  }

  export type messagesUpdateWithWhereUniqueWithoutChatInput = {
    where: messagesWhereUniqueInput
    data: XOR<messagesUpdateWithoutChatInput, messagesUncheckedUpdateWithoutChatInput>
  }

  export type messagesUpdateManyWithWhereWithoutChatInput = {
    where: messagesScalarWhereInput
    data: XOR<messagesUpdateManyMutationInput, messagesUncheckedUpdateManyWithoutChatInput>
  }

  export type messagesScalarWhereInput = {
    AND?: messagesScalarWhereInput | messagesScalarWhereInput[]
    OR?: messagesScalarWhereInput[]
    NOT?: messagesScalarWhereInput | messagesScalarWhereInput[]
    id?: IntFilter<"messages"> | number
    chatId?: IntFilter<"messages"> | number
    userId?: IntFilter<"messages"> | number
    message?: StringFilter<"messages"> | string
    date?: DateTimeFilter<"messages"> | Date | string
  }

  export type messagesCreateWithoutUserInput = {
    message: string
    date?: Date | string
    chat: chatsCreateNestedOneWithoutMessagesInput
  }

  export type messagesUncheckedCreateWithoutUserInput = {
    id?: number
    chatId: number
    message: string
    date?: Date | string
  }

  export type messagesCreateOrConnectWithoutUserInput = {
    where: messagesWhereUniqueInput
    create: XOR<messagesCreateWithoutUserInput, messagesUncheckedCreateWithoutUserInput>
  }

  export type messagesCreateManyUserInputEnvelope = {
    data: messagesCreateManyUserInput | messagesCreateManyUserInput[]
  }

  export type chatsCreateWithoutHostInput = {
    name: string
    lastAccessed?: Date | string | null
    users?: userCreateNestedManyWithoutMembersInput
    messages?: messagesCreateNestedManyWithoutChatInput
  }

  export type chatsUncheckedCreateWithoutHostInput = {
    chatId?: number
    name: string
    lastAccessed?: Date | string | null
    users?: userUncheckedCreateNestedManyWithoutMembersInput
    messages?: messagesUncheckedCreateNestedManyWithoutChatInput
  }

  export type chatsCreateOrConnectWithoutHostInput = {
    where: chatsWhereUniqueInput
    create: XOR<chatsCreateWithoutHostInput, chatsUncheckedCreateWithoutHostInput>
  }

  export type chatsCreateManyHostInputEnvelope = {
    data: chatsCreateManyHostInput | chatsCreateManyHostInput[]
  }

  export type chatsCreateWithoutUsersInput = {
    name: string
    lastAccessed?: Date | string | null
    host: userCreateNestedOneWithoutChatHostInput
    messages?: messagesCreateNestedManyWithoutChatInput
  }

  export type chatsUncheckedCreateWithoutUsersInput = {
    chatId?: number
    hostId: number
    name: string
    lastAccessed?: Date | string | null
    messages?: messagesUncheckedCreateNestedManyWithoutChatInput
  }

  export type chatsCreateOrConnectWithoutUsersInput = {
    where: chatsWhereUniqueInput
    create: XOR<chatsCreateWithoutUsersInput, chatsUncheckedCreateWithoutUsersInput>
  }

  export type userCreateWithoutBlockedByInput = {
    linkId: number
    username: string
    messages?: messagesCreateNestedManyWithoutUserInput
    chatHost?: chatsCreateNestedManyWithoutHostInput
    members?: chatsCreateNestedManyWithoutUsersInput
    blockedUsers?: userCreateNestedManyWithoutBlockedByInput
  }

  export type userUncheckedCreateWithoutBlockedByInput = {
    userId?: number
    linkId: number
    username: string
    messages?: messagesUncheckedCreateNestedManyWithoutUserInput
    chatHost?: chatsUncheckedCreateNestedManyWithoutHostInput
    members?: chatsUncheckedCreateNestedManyWithoutUsersInput
    blockedUsers?: userUncheckedCreateNestedManyWithoutBlockedByInput
  }

  export type userCreateOrConnectWithoutBlockedByInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutBlockedByInput, userUncheckedCreateWithoutBlockedByInput>
  }

  export type userCreateWithoutBlockedUsersInput = {
    linkId: number
    username: string
    messages?: messagesCreateNestedManyWithoutUserInput
    chatHost?: chatsCreateNestedManyWithoutHostInput
    members?: chatsCreateNestedManyWithoutUsersInput
    blockedBy?: userCreateNestedManyWithoutBlockedUsersInput
  }

  export type userUncheckedCreateWithoutBlockedUsersInput = {
    userId?: number
    linkId: number
    username: string
    messages?: messagesUncheckedCreateNestedManyWithoutUserInput
    chatHost?: chatsUncheckedCreateNestedManyWithoutHostInput
    members?: chatsUncheckedCreateNestedManyWithoutUsersInput
    blockedBy?: userUncheckedCreateNestedManyWithoutBlockedUsersInput
  }

  export type userCreateOrConnectWithoutBlockedUsersInput = {
    where: userWhereUniqueInput
    create: XOR<userCreateWithoutBlockedUsersInput, userUncheckedCreateWithoutBlockedUsersInput>
  }

  export type messagesUpsertWithWhereUniqueWithoutUserInput = {
    where: messagesWhereUniqueInput
    update: XOR<messagesUpdateWithoutUserInput, messagesUncheckedUpdateWithoutUserInput>
    create: XOR<messagesCreateWithoutUserInput, messagesUncheckedCreateWithoutUserInput>
  }

  export type messagesUpdateWithWhereUniqueWithoutUserInput = {
    where: messagesWhereUniqueInput
    data: XOR<messagesUpdateWithoutUserInput, messagesUncheckedUpdateWithoutUserInput>
  }

  export type messagesUpdateManyWithWhereWithoutUserInput = {
    where: messagesScalarWhereInput
    data: XOR<messagesUpdateManyMutationInput, messagesUncheckedUpdateManyWithoutUserInput>
  }

  export type chatsUpsertWithWhereUniqueWithoutHostInput = {
    where: chatsWhereUniqueInput
    update: XOR<chatsUpdateWithoutHostInput, chatsUncheckedUpdateWithoutHostInput>
    create: XOR<chatsCreateWithoutHostInput, chatsUncheckedCreateWithoutHostInput>
  }

  export type chatsUpdateWithWhereUniqueWithoutHostInput = {
    where: chatsWhereUniqueInput
    data: XOR<chatsUpdateWithoutHostInput, chatsUncheckedUpdateWithoutHostInput>
  }

  export type chatsUpdateManyWithWhereWithoutHostInput = {
    where: chatsScalarWhereInput
    data: XOR<chatsUpdateManyMutationInput, chatsUncheckedUpdateManyWithoutHostInput>
  }

  export type chatsScalarWhereInput = {
    AND?: chatsScalarWhereInput | chatsScalarWhereInput[]
    OR?: chatsScalarWhereInput[]
    NOT?: chatsScalarWhereInput | chatsScalarWhereInput[]
    chatId?: IntFilter<"chats"> | number
    hostId?: IntFilter<"chats"> | number
    name?: StringFilter<"chats"> | string
    lastAccessed?: DateTimeNullableFilter<"chats"> | Date | string | null
  }

  export type chatsUpsertWithWhereUniqueWithoutUsersInput = {
    where: chatsWhereUniqueInput
    update: XOR<chatsUpdateWithoutUsersInput, chatsUncheckedUpdateWithoutUsersInput>
    create: XOR<chatsCreateWithoutUsersInput, chatsUncheckedCreateWithoutUsersInput>
  }

  export type chatsUpdateWithWhereUniqueWithoutUsersInput = {
    where: chatsWhereUniqueInput
    data: XOR<chatsUpdateWithoutUsersInput, chatsUncheckedUpdateWithoutUsersInput>
  }

  export type chatsUpdateManyWithWhereWithoutUsersInput = {
    where: chatsScalarWhereInput
    data: XOR<chatsUpdateManyMutationInput, chatsUncheckedUpdateManyWithoutUsersInput>
  }

  export type userUpsertWithWhereUniqueWithoutBlockedByInput = {
    where: userWhereUniqueInput
    update: XOR<userUpdateWithoutBlockedByInput, userUncheckedUpdateWithoutBlockedByInput>
    create: XOR<userCreateWithoutBlockedByInput, userUncheckedCreateWithoutBlockedByInput>
  }

  export type userUpdateWithWhereUniqueWithoutBlockedByInput = {
    where: userWhereUniqueInput
    data: XOR<userUpdateWithoutBlockedByInput, userUncheckedUpdateWithoutBlockedByInput>
  }

  export type userUpdateManyWithWhereWithoutBlockedByInput = {
    where: userScalarWhereInput
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyWithoutBlockedByInput>
  }

  export type userUpsertWithWhereUniqueWithoutBlockedUsersInput = {
    where: userWhereUniqueInput
    update: XOR<userUpdateWithoutBlockedUsersInput, userUncheckedUpdateWithoutBlockedUsersInput>
    create: XOR<userCreateWithoutBlockedUsersInput, userUncheckedCreateWithoutBlockedUsersInput>
  }

  export type userUpdateWithWhereUniqueWithoutBlockedUsersInput = {
    where: userWhereUniqueInput
    data: XOR<userUpdateWithoutBlockedUsersInput, userUncheckedUpdateWithoutBlockedUsersInput>
  }

  export type userUpdateManyWithWhereWithoutBlockedUsersInput = {
    where: userScalarWhereInput
    data: XOR<userUpdateManyMutationInput, userUncheckedUpdateManyWithoutBlockedUsersInput>
  }

  export type messagesCreateManyChatInput = {
    id?: number
    userId: number
    message: string
    date?: Date | string
  }

  export type userUpdateWithoutMembersInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    messages?: messagesUpdateManyWithoutUserNestedInput
    chatHost?: chatsUpdateManyWithoutHostNestedInput
    blockedUsers?: userUpdateManyWithoutBlockedByNestedInput
    blockedBy?: userUpdateManyWithoutBlockedUsersNestedInput
  }

  export type userUncheckedUpdateWithoutMembersInput = {
    userId?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    messages?: messagesUncheckedUpdateManyWithoutUserNestedInput
    chatHost?: chatsUncheckedUpdateManyWithoutHostNestedInput
    blockedUsers?: userUncheckedUpdateManyWithoutBlockedByNestedInput
    blockedBy?: userUncheckedUpdateManyWithoutBlockedUsersNestedInput
  }

  export type userUncheckedUpdateManyWithoutMembersInput = {
    userId?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
  }

  export type messagesUpdateWithoutChatInput = {
    message?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: userUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type messagesUncheckedUpdateWithoutChatInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messagesUncheckedUpdateManyWithoutChatInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messagesCreateManyUserInput = {
    id?: number
    chatId: number
    message: string
    date?: Date | string
  }

  export type chatsCreateManyHostInput = {
    chatId?: number
    name: string
    lastAccessed?: Date | string | null
  }

  export type messagesUpdateWithoutUserInput = {
    message?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    chat?: chatsUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type messagesUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    chatId?: IntFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messagesUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    chatId?: IntFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chatsUpdateWithoutHostInput = {
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: userUpdateManyWithoutMembersNestedInput
    messages?: messagesUpdateManyWithoutChatNestedInput
  }

  export type chatsUncheckedUpdateWithoutHostInput = {
    chatId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: userUncheckedUpdateManyWithoutMembersNestedInput
    messages?: messagesUncheckedUpdateManyWithoutChatNestedInput
  }

  export type chatsUncheckedUpdateManyWithoutHostInput = {
    chatId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type chatsUpdateWithoutUsersInput = {
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    host?: userUpdateOneRequiredWithoutChatHostNestedInput
    messages?: messagesUpdateManyWithoutChatNestedInput
  }

  export type chatsUncheckedUpdateWithoutUsersInput = {
    chatId?: IntFieldUpdateOperationsInput | number
    hostId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages?: messagesUncheckedUpdateManyWithoutChatNestedInput
  }

  export type chatsUncheckedUpdateManyWithoutUsersInput = {
    chatId?: IntFieldUpdateOperationsInput | number
    hostId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    lastAccessed?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type userUpdateWithoutBlockedByInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    messages?: messagesUpdateManyWithoutUserNestedInput
    chatHost?: chatsUpdateManyWithoutHostNestedInput
    members?: chatsUpdateManyWithoutUsersNestedInput
    blockedUsers?: userUpdateManyWithoutBlockedByNestedInput
  }

  export type userUncheckedUpdateWithoutBlockedByInput = {
    userId?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    messages?: messagesUncheckedUpdateManyWithoutUserNestedInput
    chatHost?: chatsUncheckedUpdateManyWithoutHostNestedInput
    members?: chatsUncheckedUpdateManyWithoutUsersNestedInput
    blockedUsers?: userUncheckedUpdateManyWithoutBlockedByNestedInput
  }

  export type userUncheckedUpdateManyWithoutBlockedByInput = {
    userId?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
  }

  export type userUpdateWithoutBlockedUsersInput = {
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    messages?: messagesUpdateManyWithoutUserNestedInput
    chatHost?: chatsUpdateManyWithoutHostNestedInput
    members?: chatsUpdateManyWithoutUsersNestedInput
    blockedBy?: userUpdateManyWithoutBlockedUsersNestedInput
  }

  export type userUncheckedUpdateWithoutBlockedUsersInput = {
    userId?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    messages?: messagesUncheckedUpdateManyWithoutUserNestedInput
    chatHost?: chatsUncheckedUpdateManyWithoutHostNestedInput
    members?: chatsUncheckedUpdateManyWithoutUsersNestedInput
    blockedBy?: userUncheckedUpdateManyWithoutBlockedUsersNestedInput
  }

  export type userUncheckedUpdateManyWithoutBlockedUsersInput = {
    userId?: IntFieldUpdateOperationsInput | number
    linkId?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
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