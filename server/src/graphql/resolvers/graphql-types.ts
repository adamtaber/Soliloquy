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

export type Comment = {
  __typename?: 'Comment';
  commentId: Scalars['ID'];
  content: Scalars['String'];
  createdOn: Scalars['String'];
  parentCommentId?: Maybe<Scalars['ID']>;
  postId?: Maybe<Scalars['ID']>;
  userId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: Comment;
  createPost: Post;
  createUser: User;
  deleteComment: Scalars['Boolean'];
  deletePost: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  followUser: Scalars['String'];
  login: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  unfollowUser: Scalars['Boolean'];
  updateUser: User;
};


export type MutationCreateCommentArgs = {
  content: Scalars['String'];
  parentCommentId?: InputMaybe<Scalars['String']>;
  postId?: InputMaybe<Scalars['String']>;
};


export type MutationCreatePostArgs = {
  content: Scalars['String'];
};


export type MutationCreateUserArgs = {
  displayname: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['String'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['String'];
};


export type MutationFollowUserArgs = {
  followUserId: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUnfollowUserArgs = {
  userId: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  displayname: Scalars['String'];
  username: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  content: Scalars['String'];
  createdOn: Scalars['String'];
  postId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  allUsers: Array<Maybe<User>>;
  currentUser?: Maybe<User>;
  findUser?: Maybe<User>;
  getComments: Array<Maybe<Comment>>;
  getFeedPosts: Array<Maybe<Post>>;
  getFollowers: Array<Maybe<User>>;
  getFollowing: Array<Maybe<User>>;
  getUserPosts: Array<Maybe<Post>>;
};


export type QueryFindUserArgs = {
  userId: Scalars['String'];
};


export type QueryGetCommentsArgs = {
  parentCommentId?: InputMaybe<Scalars['String']>;
  postId?: InputMaybe<Scalars['String']>;
};


export type QueryGetFollowersArgs = {
  userId: Scalars['String'];
};


export type QueryGetFollowingArgs = {
  userId: Scalars['String'];
};


export type QueryGetUserPostsArgs = {
  userId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdOn: Scalars['String'];
  displayname: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  userId: Scalars['ID'];
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Comment: ResolverTypeWrapper<Comment>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  Comment: Comment;
  ID: Scalars['ID'];
  Mutation: {};
  Post: Post;
  Query: {};
  String: Scalars['String'];
  User: User;
}>;

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = ResolversObject<{
  commentId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parentCommentId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  postId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationCreateCommentArgs, 'content'>>;
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'content'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'displayname' | 'email' | 'password' | 'username'>>;
  deleteComment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCommentArgs, 'commentId'>>;
  deletePost?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePostArgs, 'postId'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  followUser?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationFollowUserArgs, 'followUserId'>>;
  login?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  unfollowUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnfollowUserArgs, 'userId'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'displayname' | 'username'>>;
}>;

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  allUsers?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  findUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryFindUserArgs, 'userId'>>;
  getComments?: Resolver<Array<Maybe<ResolversTypes['Comment']>>, ParentType, ContextType, Partial<QueryGetCommentsArgs>>;
  getFeedPosts?: Resolver<Array<Maybe<ResolversTypes['Post']>>, ParentType, ContextType>;
  getFollowers?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryGetFollowersArgs, 'userId'>>;
  getFollowing?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryGetFollowingArgs, 'userId'>>;
  getUserPosts?: Resolver<Array<Maybe<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryGetUserPostsArgs, 'userId'>>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  createdOn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Comment?: CommentResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

