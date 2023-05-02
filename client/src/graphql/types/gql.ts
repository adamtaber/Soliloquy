/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment PostFields on Post {\n    postId\n    userId\n    content\n    createdOn\n  }\n": types.PostFieldsFragmentDoc,
    "\n  query getUserPosts($userId: String!) {\n    getUserPosts(userId: $userId) {\n      ...PostFields\n    }\n  }\n": types.GetUserPostsDocument,
    "\n  query getFeedPosts {\n    getFeedPosts {\n      ...PostFields\n      displayname\n    }\n  }\n": types.GetFeedPostsDocument,
    "\n  fragment UserFields on User {\n    displayname\n    username\n    userId\n    email\n  }\n": types.UserFieldsFragmentDoc,
    "\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password)\n  }\n": types.LoginDocument,
    "\n  mutation logout{\n    logout\n  }\n": types.LogoutDocument,
    "\n  query currentUser {\n    currentUser {\n      ...UserFields\n    }\n  }\n": types.CurrentUserDocument,
    "\n  query findUser($userId: String!) {\n    findUser(userId: $userId) {\n      ...UserFields\n    }\n  }\n": types.FindUserDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment PostFields on Post {\n    postId\n    userId\n    content\n    createdOn\n  }\n"): (typeof documents)["\n  fragment PostFields on Post {\n    postId\n    userId\n    content\n    createdOn\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUserPosts($userId: String!) {\n    getUserPosts(userId: $userId) {\n      ...PostFields\n    }\n  }\n"): (typeof documents)["\n  query getUserPosts($userId: String!) {\n    getUserPosts(userId: $userId) {\n      ...PostFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getFeedPosts {\n    getFeedPosts {\n      ...PostFields\n      displayname\n    }\n  }\n"): (typeof documents)["\n  query getFeedPosts {\n    getFeedPosts {\n      ...PostFields\n      displayname\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment UserFields on User {\n    displayname\n    username\n    userId\n    email\n  }\n"): (typeof documents)["\n  fragment UserFields on User {\n    displayname\n    username\n    userId\n    email\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password)\n  }\n"): (typeof documents)["\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation logout{\n    logout\n  }\n"): (typeof documents)["\n  mutation logout{\n    logout\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query currentUser {\n    currentUser {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  query currentUser {\n    currentUser {\n      ...UserFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query findUser($userId: String!) {\n    findUser(userId: $userId) {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  query findUser($userId: String!) {\n    findUser(userId: $userId) {\n      ...UserFields\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;