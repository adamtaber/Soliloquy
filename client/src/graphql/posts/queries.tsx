import { gql } from "../types";


export const GET_USER_POSTS = gql(`
  query getUserPosts($userId: String!) {
    getUserPosts(userId: $userId) {
      ...PostFields
    }
  }
`)

export const GET_FEED_POSTS = gql(`
  query getFeedPosts {
    getFeedPosts {
      ...PostFields
      displayname
    }
  }
`)

export const GET_POST = gql(`
  query getPost($postId: String!) {
    getPost(postId: $postId) {
      ...PostFields
    }
  }
`)