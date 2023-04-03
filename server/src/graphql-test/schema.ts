
export const typeDefs = `
  type User {
    user_id: ID!,
    displayname: String!,
    username: String!,
    password: String!,
    created_on: String!
  }

  type Post {
    post_id: ID!,
    user_id: ID!,
    content: String!,
    created_on: String!
  }

  type Comment {
    comment_id: ID!,
    user_id: ID!,
    post_id: ID,
    parent_comment_id: ID,
    content: String!,
    created_on: String!
  }

  type Like {
    like_id: ID!,
    user_id: ID!,
    post_id: ID,
    comment_id: ID,
    created_on: String!
  }

  type Bookmark {
    bookmark_id: ID!,
    user_id: ID!,
    post_id: ID,
    comment_id: ID,
    created_on: String!
  }

  type Query {
    allUsers: [User]!
    findUser(user_id: String!): User
    currentUser: User
  }

  type Mutation {
    createUser(
      displayname: String, 
      username: String, 
      email: String, 
      password: String
    ): User
  }
`
