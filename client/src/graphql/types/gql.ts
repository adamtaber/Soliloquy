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
    "\n  fragment CommentFields on Comment {\n    postId\n    commentId\n    parentCommentId\n    content\n    createdOn\n    likesCount\n    currentUserLike\n    user {\n      ...UserFields\n    }\n  }\n": types.CommentFieldsFragmentDoc,
    "\n  mutation createComment($postId: String!, $parentCommentId: String, $content: String!) {\n    createComment(postId: $postId, parentCommentId: $parentCommentId, content: $content) {\n      ...CommentFields\n    }\n  }\n": types.CreateCommentDocument,
    "\n  mutation deleteComment($commentId: String!) {\n    deleteComment(commentId: $commentId)\n  }\n": types.DeleteCommentDocument,
    "\n  query getComments($postId: String!) {\n    getComments(postId: $postId) {\n      ...CommentFields\n    }\n  }\n": types.GetCommentsDocument,
    "\n  query getChildComments($postId: String!, $parentCommentId: String!) {\n    getChildComments(postId: $postId, parentCommentId: $parentCommentId) {\n      ...CommentFields\n    }\n  }\n": types.GetChildCommentsDocument,
    "\n  fragment LikeFields on Like {\n    likeId\n    userId\n    commentId\n    postId\n    createdOn\n  }\n": types.LikeFieldsFragmentDoc,
    "\n  mutation likeContent($postId: String, $commentId: String) {\n    likeContent(postId: $postId, commentId: $commentId)\n  }\n": types.LikeContentDocument,
    "\n  mutation deleteLike($postId: String, $commentId: String) {\n    deleteLike(postId: $postId, commentId: $commentId)\n  }\n": types.DeleteLikeDocument,
    "\n  fragment MessageFields on Message {\n    messageId\n    content\n    createdOn\n    sender {\n      ...UserFields\n    }\n    receiver {\n      ...UserFields\n    }\n  }\n": types.MessageFieldsFragmentDoc,
    "\n  mutation createMessage($receiverId: String!, $content: String!) {\n    createMessage(receiverId: $receiverId, content: $content) {\n      ...MessageFields\n    }\n  }\n": types.CreateMessageDocument,
    "\n  mutation deleteMessage($messageId: String!) {\n    deleteMessage(messageId: $messageId)\n  }\n": types.DeleteMessageDocument,
    "\n  query getMessages($messagePartnerId: String!) {\n    getMessages(messagePartnerId: $messagePartnerId) {\n      ...MessageFields\n    }\n  }\n": types.GetMessagesDocument,
    "\n  query getMessagePartners {\n    getMessagePartners {\n      userId\n      username\n      displayname\n      recentMessage\n    }\n  }\n": types.GetMessagePartnersDocument,
    "\n  subscription messageSent($receiverId: String!){\n    messageSent(receiverId: $receiverId) {\n      ...MessageFields\n    }\n  }\n": types.MessageSentDocument,
    "\n  subscription messageDeleted($receiverId: String!){\n    messageDeleted(receiverId: $receiverId) {\n      ...MessageFields\n    }\n  }\n": types.MessageDeletedDocument,
    "\n  fragment PostFields on Post {\n    postId\n    content\n    createdOn\n    likesCount\n    currentUserLike\n    poster {\n      ...UserFields\n    }\n  }\n": types.PostFieldsFragmentDoc,
    "\n  mutation createPost($content: String!) {\n    createPost(content: $content) {\n      ...PostFields\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation deletePost($postId: String!) {\n    deletePost(postId: $postId)\n  }\n": types.DeletePostDocument,
    "\n  query getUserPosts($userId: String!) {\n    getUserPosts(userId: $userId) {\n      ...PostFields\n    }\n  }\n": types.GetUserPostsDocument,
    "\n  query getFeedPosts($lastPostId: String, $lastCreatedOn: Date, $limit: Int!) {\n    getFeedPosts(lastPostId: $lastPostId, lastCreatedOn: $lastCreatedOn, limit: $limit) {\n      ...PostFields\n    }\n  }\n": types.GetFeedPostsDocument,
    "\n  query getPost($postId: String!) {\n    getPost(postId: $postId) {\n      ...PostFields\n    }\n  }\n": types.GetPostDocument,
    "\n  fragment UserFields on User {\n    displayname\n    username\n    userId\n    email\n  }\n": types.UserFieldsFragmentDoc,
    "\n  mutation login($username: String!, $password: String!) {\n    login(username: $username, password: $password)\n  }\n": types.LoginDocument,
    "\n  mutation logout{\n    logout\n  }\n": types.LogoutDocument,
    "\n  mutation followUser($followUserId: String!) {\n    followUser(followUserId: $followUserId)\n  }\n": types.FollowUserDocument,
    "\n  mutation unfollowUser($userId: String!) {\n    unfollowUser(userId: $userId)\n  }\n": types.UnfollowUserDocument,
    "\n  mutation createUser($displayname: String!, $username: String!,\n    $email: String!, $password: String!) {\n      createUser(displayname: $displayname, username: $username, \n        email: $email, password: $password) {\n          ...UserFields\n        }\n    }\n": types.CreateUserDocument,
    "\n  query currentUser {\n    currentUser {\n      ...UserFields\n    }\n  }\n": types.CurrentUserDocument,
    "\n  query findUser($userId: String!) {\n    findUser(userId: $userId) {\n      ...UserFields\n    }\n  }\n": types.FindUserDocument,
    "\n  query getFollowers($userId: String!) {\n    getFollowers(userId: $userId) {\n      ...UserFields\n    }\n  }\n": types.GetFollowersDocument,
    "\n  query getFollowerCount($userId: String!) {\n    getFollowerCount(userId: $userId)\n  }\n": types.GetFollowerCountDocument,
    "\n  query getFollowing($userId: String!) {\n    getFollowing(userId: $userId) {\n      ...UserFields\n    }\n  }\n": types.GetFollowingDocument,
    "\n  query getFollowingCount($userId: String!) {\n    getFollowingCount(userId: $userId)\n  }\n": types.GetFollowingCountDocument,
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
export function gql(source: "\n  fragment CommentFields on Comment {\n    postId\n    commentId\n    parentCommentId\n    content\n    createdOn\n    likesCount\n    currentUserLike\n    user {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  fragment CommentFields on Comment {\n    postId\n    commentId\n    parentCommentId\n    content\n    createdOn\n    likesCount\n    currentUserLike\n    user {\n      ...UserFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createComment($postId: String!, $parentCommentId: String, $content: String!) {\n    createComment(postId: $postId, parentCommentId: $parentCommentId, content: $content) {\n      ...CommentFields\n    }\n  }\n"): (typeof documents)["\n  mutation createComment($postId: String!, $parentCommentId: String, $content: String!) {\n    createComment(postId: $postId, parentCommentId: $parentCommentId, content: $content) {\n      ...CommentFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteComment($commentId: String!) {\n    deleteComment(commentId: $commentId)\n  }\n"): (typeof documents)["\n  mutation deleteComment($commentId: String!) {\n    deleteComment(commentId: $commentId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getComments($postId: String!) {\n    getComments(postId: $postId) {\n      ...CommentFields\n    }\n  }\n"): (typeof documents)["\n  query getComments($postId: String!) {\n    getComments(postId: $postId) {\n      ...CommentFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getChildComments($postId: String!, $parentCommentId: String!) {\n    getChildComments(postId: $postId, parentCommentId: $parentCommentId) {\n      ...CommentFields\n    }\n  }\n"): (typeof documents)["\n  query getChildComments($postId: String!, $parentCommentId: String!) {\n    getChildComments(postId: $postId, parentCommentId: $parentCommentId) {\n      ...CommentFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment LikeFields on Like {\n    likeId\n    userId\n    commentId\n    postId\n    createdOn\n  }\n"): (typeof documents)["\n  fragment LikeFields on Like {\n    likeId\n    userId\n    commentId\n    postId\n    createdOn\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation likeContent($postId: String, $commentId: String) {\n    likeContent(postId: $postId, commentId: $commentId)\n  }\n"): (typeof documents)["\n  mutation likeContent($postId: String, $commentId: String) {\n    likeContent(postId: $postId, commentId: $commentId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteLike($postId: String, $commentId: String) {\n    deleteLike(postId: $postId, commentId: $commentId)\n  }\n"): (typeof documents)["\n  mutation deleteLike($postId: String, $commentId: String) {\n    deleteLike(postId: $postId, commentId: $commentId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment MessageFields on Message {\n    messageId\n    content\n    createdOn\n    sender {\n      ...UserFields\n    }\n    receiver {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  fragment MessageFields on Message {\n    messageId\n    content\n    createdOn\n    sender {\n      ...UserFields\n    }\n    receiver {\n      ...UserFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createMessage($receiverId: String!, $content: String!) {\n    createMessage(receiverId: $receiverId, content: $content) {\n      ...MessageFields\n    }\n  }\n"): (typeof documents)["\n  mutation createMessage($receiverId: String!, $content: String!) {\n    createMessage(receiverId: $receiverId, content: $content) {\n      ...MessageFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deleteMessage($messageId: String!) {\n    deleteMessage(messageId: $messageId)\n  }\n"): (typeof documents)["\n  mutation deleteMessage($messageId: String!) {\n    deleteMessage(messageId: $messageId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getMessages($messagePartnerId: String!) {\n    getMessages(messagePartnerId: $messagePartnerId) {\n      ...MessageFields\n    }\n  }\n"): (typeof documents)["\n  query getMessages($messagePartnerId: String!) {\n    getMessages(messagePartnerId: $messagePartnerId) {\n      ...MessageFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getMessagePartners {\n    getMessagePartners {\n      userId\n      username\n      displayname\n      recentMessage\n    }\n  }\n"): (typeof documents)["\n  query getMessagePartners {\n    getMessagePartners {\n      userId\n      username\n      displayname\n      recentMessage\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription messageSent($receiverId: String!){\n    messageSent(receiverId: $receiverId) {\n      ...MessageFields\n    }\n  }\n"): (typeof documents)["\n  subscription messageSent($receiverId: String!){\n    messageSent(receiverId: $receiverId) {\n      ...MessageFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription messageDeleted($receiverId: String!){\n    messageDeleted(receiverId: $receiverId) {\n      ...MessageFields\n    }\n  }\n"): (typeof documents)["\n  subscription messageDeleted($receiverId: String!){\n    messageDeleted(receiverId: $receiverId) {\n      ...MessageFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment PostFields on Post {\n    postId\n    content\n    createdOn\n    likesCount\n    currentUserLike\n    poster {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  fragment PostFields on Post {\n    postId\n    content\n    createdOn\n    likesCount\n    currentUserLike\n    poster {\n      ...UserFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createPost($content: String!) {\n    createPost(content: $content) {\n      ...PostFields\n    }\n  }\n"): (typeof documents)["\n  mutation createPost($content: String!) {\n    createPost(content: $content) {\n      ...PostFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation deletePost($postId: String!) {\n    deletePost(postId: $postId)\n  }\n"): (typeof documents)["\n  mutation deletePost($postId: String!) {\n    deletePost(postId: $postId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getUserPosts($userId: String!) {\n    getUserPosts(userId: $userId) {\n      ...PostFields\n    }\n  }\n"): (typeof documents)["\n  query getUserPosts($userId: String!) {\n    getUserPosts(userId: $userId) {\n      ...PostFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getFeedPosts($lastPostId: String, $lastCreatedOn: Date, $limit: Int!) {\n    getFeedPosts(lastPostId: $lastPostId, lastCreatedOn: $lastCreatedOn, limit: $limit) {\n      ...PostFields\n    }\n  }\n"): (typeof documents)["\n  query getFeedPosts($lastPostId: String, $lastCreatedOn: Date, $limit: Int!) {\n    getFeedPosts(lastPostId: $lastPostId, lastCreatedOn: $lastCreatedOn, limit: $limit) {\n      ...PostFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getPost($postId: String!) {\n    getPost(postId: $postId) {\n      ...PostFields\n    }\n  }\n"): (typeof documents)["\n  query getPost($postId: String!) {\n    getPost(postId: $postId) {\n      ...PostFields\n    }\n  }\n"];
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
export function gql(source: "\n  mutation followUser($followUserId: String!) {\n    followUser(followUserId: $followUserId)\n  }\n"): (typeof documents)["\n  mutation followUser($followUserId: String!) {\n    followUser(followUserId: $followUserId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation unfollowUser($userId: String!) {\n    unfollowUser(userId: $userId)\n  }\n"): (typeof documents)["\n  mutation unfollowUser($userId: String!) {\n    unfollowUser(userId: $userId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createUser($displayname: String!, $username: String!,\n    $email: String!, $password: String!) {\n      createUser(displayname: $displayname, username: $username, \n        email: $email, password: $password) {\n          ...UserFields\n        }\n    }\n"): (typeof documents)["\n  mutation createUser($displayname: String!, $username: String!,\n    $email: String!, $password: String!) {\n      createUser(displayname: $displayname, username: $username, \n        email: $email, password: $password) {\n          ...UserFields\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query currentUser {\n    currentUser {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  query currentUser {\n    currentUser {\n      ...UserFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query findUser($userId: String!) {\n    findUser(userId: $userId) {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  query findUser($userId: String!) {\n    findUser(userId: $userId) {\n      ...UserFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getFollowers($userId: String!) {\n    getFollowers(userId: $userId) {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  query getFollowers($userId: String!) {\n    getFollowers(userId: $userId) {\n      ...UserFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getFollowerCount($userId: String!) {\n    getFollowerCount(userId: $userId)\n  }\n"): (typeof documents)["\n  query getFollowerCount($userId: String!) {\n    getFollowerCount(userId: $userId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getFollowing($userId: String!) {\n    getFollowing(userId: $userId) {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  query getFollowing($userId: String!) {\n    getFollowing(userId: $userId) {\n      ...UserFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getFollowingCount($userId: String!) {\n    getFollowingCount(userId: $userId)\n  }\n"): (typeof documents)["\n  query getFollowingCount($userId: String!) {\n    getFollowingCount(userId: $userId)\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;