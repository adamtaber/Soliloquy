import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  Date: any;
};

export type BasicUser = {
  __typename?: 'BasicUser';
  displayname: Scalars['String'];
  recentMessage: Scalars['String'];
  userId: Scalars['ID'];
  username: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  commentId: Scalars['ID'];
  content: Scalars['String'];
  createdOn: Scalars['String'];
  parentCommentId?: Maybe<Scalars['ID']>;
  postId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String'];
  createdOn: Scalars['String'];
  messageId: Scalars['ID'];
  receiver: User;
  sender: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: Comment;
  createMessage: Message;
  createPost: Post;
  createUser: User;
  deleteComment: Scalars['Boolean'];
  deleteMessage: Scalars['Boolean'];
  deletePost: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  followUser: Scalars['String'];
  generateFollowers?: Maybe<Scalars['Boolean']>;
  generatePosts?: Maybe<Scalars['Boolean']>;
  generateUsers: Array<Maybe<User>>;
  login: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  unfollowUser: Scalars['Boolean'];
  updateUser: User;
};


export type MutationCreateCommentArgs = {
  content: Scalars['String'];
  parentCommentId?: InputMaybe<Scalars['String']>;
  postId: Scalars['String'];
};


export type MutationCreateMessageArgs = {
  content: Scalars['String'];
  receiverId: Scalars['String'];
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


export type MutationDeleteMessageArgs = {
  messageId: Scalars['String'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['String'];
};


export type MutationFollowUserArgs = {
  followUserId: Scalars['String'];
};


export type MutationGenerateUsersArgs = {
  quantity: Scalars['Int'];
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
  createdOn: Scalars['Date'];
  displayname?: Maybe<Scalars['String']>;
  postId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  allUsers: Array<Maybe<User>>;
  currentUser?: Maybe<User>;
  findUser?: Maybe<User>;
  getChildComments: Array<Maybe<Comment>>;
  getComments: Array<Maybe<Comment>>;
  getFeedPosts: Array<Maybe<Post>>;
  getFollowers: Array<Maybe<User>>;
  getFollowing: Array<Maybe<User>>;
  getMessagePartners: Array<Maybe<BasicUser>>;
  getMessages: Array<Maybe<Message>>;
  getPost?: Maybe<Post>;
  getUserPosts: Array<Maybe<Post>>;
};


export type QueryFindUserArgs = {
  userId: Scalars['String'];
};


export type QueryGetChildCommentsArgs = {
  parentCommentId: Scalars['String'];
  postId: Scalars['String'];
};


export type QueryGetCommentsArgs = {
  postId: Scalars['String'];
};


export type QueryGetFeedPostsArgs = {
  lastCreatedOn?: InputMaybe<Scalars['Date']>;
  lastPostId?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryGetFollowersArgs = {
  userId: Scalars['String'];
};


export type QueryGetFollowingArgs = {
  userId: Scalars['String'];
};


export type QueryGetMessagesArgs = {
  messagePartnerId: Scalars['String'];
};


export type QueryGetPostArgs = {
  postId: Scalars['String'];
};


export type QueryGetUserPostsArgs = {
  userId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  messageDeleted?: Maybe<Message>;
  messageSent?: Maybe<Message>;
};


export type SubscriptionMessageDeletedArgs = {
  receiverId: Scalars['String'];
};


export type SubscriptionMessageSentArgs = {
  receiverId: Scalars['String'];
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
  BasicUser: ResolverTypeWrapper<BasicUser>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Comment: ResolverTypeWrapper<Comment>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Message: ResolverTypeWrapper<Message>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BasicUser: BasicUser;
  Boolean: Scalars['Boolean'];
  Comment: Comment;
  Date: Scalars['Date'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Message: Message;
  Mutation: {};
  Post: Post;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  User: User;
}>;

export type BasicUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['BasicUser'] = ResolversParentTypes['BasicUser']> = ResolversObject<{
  displayname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recentMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = ResolversObject<{
  commentId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parentCommentId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  postId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  messageId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  receiver?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationCreateCommentArgs, 'content' | 'postId'>>;
  createMessage?: Resolver<ResolversTypes['Message'], ParentType, ContextType, RequireFields<MutationCreateMessageArgs, 'content' | 'receiverId'>>;
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'content'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'displayname' | 'email' | 'password' | 'username'>>;
  deleteComment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCommentArgs, 'commentId'>>;
  deleteMessage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteMessageArgs, 'messageId'>>;
  deletePost?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePostArgs, 'postId'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  followUser?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationFollowUserArgs, 'followUserId'>>;
  generateFollowers?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  generatePosts?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  generateUsers?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<MutationGenerateUsersArgs, 'quantity'>>;
  login?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  unfollowUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnfollowUserArgs, 'userId'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'displayname' | 'username'>>;
}>;

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdOn?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  displayname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  allUsers?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  findUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryFindUserArgs, 'userId'>>;
  getChildComments?: Resolver<Array<Maybe<ResolversTypes['Comment']>>, ParentType, ContextType, RequireFields<QueryGetChildCommentsArgs, 'parentCommentId' | 'postId'>>;
  getComments?: Resolver<Array<Maybe<ResolversTypes['Comment']>>, ParentType, ContextType, RequireFields<QueryGetCommentsArgs, 'postId'>>;
  getFeedPosts?: Resolver<Array<Maybe<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryGetFeedPostsArgs, 'limit'>>;
  getFollowers?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryGetFollowersArgs, 'userId'>>;
  getFollowing?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryGetFollowingArgs, 'userId'>>;
  getMessagePartners?: Resolver<Array<Maybe<ResolversTypes['BasicUser']>>, ParentType, ContextType>;
  getMessages?: Resolver<Array<Maybe<ResolversTypes['Message']>>, ParentType, ContextType, RequireFields<QueryGetMessagesArgs, 'messagePartnerId'>>;
  getPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryGetPostArgs, 'postId'>>;
  getUserPosts?: Resolver<Array<Maybe<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryGetUserPostsArgs, 'userId'>>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  messageDeleted?: SubscriptionResolver<Maybe<ResolversTypes['Message']>, "messageDeleted", ParentType, ContextType, RequireFields<SubscriptionMessageDeletedArgs, 'receiverId'>>;
  messageSent?: SubscriptionResolver<Maybe<ResolversTypes['Message']>, "messageSent", ParentType, ContextType, RequireFields<SubscriptionMessageSentArgs, 'receiverId'>>;
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
  BasicUser?: BasicUserResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

