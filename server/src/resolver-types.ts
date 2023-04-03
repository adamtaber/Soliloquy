import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Bookmark = {
  __typename?: 'Bookmark';
  bookmark_id: Scalars['ID'];
  comment_id?: Maybe<Scalars['ID']>;
  created_on: Scalars['String'];
  post_id?: Maybe<Scalars['ID']>;
  user_id: Scalars['ID'];
};

export type Comment = {
  __typename?: 'Comment';
  comment_id: Scalars['ID'];
  content: Scalars['String'];
  created_on: Scalars['String'];
  parent_comment_id?: Maybe<Scalars['ID']>;
  post_id?: Maybe<Scalars['ID']>;
  user_id: Scalars['ID'];
};

export type Like = {
  __typename?: 'Like';
  comment_id?: Maybe<Scalars['ID']>;
  created_on: Scalars['String'];
  like_id: Scalars['ID'];
  post_id?: Maybe<Scalars['ID']>;
  user_id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser?: Maybe<User>;
};


export type MutationCreateUserArgs = {
  displayname?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  content: Scalars['String'];
  created_on: Scalars['String'];
  post_id: Scalars['ID'];
  user_id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  allUsers: Array<Maybe<User>>;
  currentUser?: Maybe<User>;
  findUser?: Maybe<User>;
};


export type QueryFindUserArgs = {
  user_id: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  created_on: Scalars['String'];
  displayname: Scalars['String'];
  password: Scalars['String'];
  user_id: Scalars['ID'];
  username: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Bookmark: ResolverTypeWrapper<Bookmark>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Comment: ResolverTypeWrapper<Comment>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Like: ResolverTypeWrapper<Like>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Bookmark: Bookmark;
  Boolean: Scalars['Boolean'];
  Comment: Comment;
  ID: Scalars['ID'];
  Like: Like;
  Mutation: {};
  Post: Post;
  Query: {};
  String: Scalars['String'];
  User: User;
}>;

export type BookmarkResolvers<ContextType = any, ParentType extends ResolversParentTypes['Bookmark'] = ResolversParentTypes['Bookmark']> = ResolversObject<{
  bookmark_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  comment_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  created_on?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  post_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = ResolversObject<{
  comment_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_on?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent_comment_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  post_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LikeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Like'] = ResolversParentTypes['Like']> = ResolversObject<{
  comment_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  created_on?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  like_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  post_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationCreateUserArgs>>;
}>;

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_on?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  post_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  allUsers?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  findUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryFindUserArgs, 'user_id'>>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  created_on?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Bookmark?: BookmarkResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  Like?: LikeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

