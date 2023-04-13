export const GET_USERS = `
  query allUsers {
    allUsers {
      username
    }
  }
`

export const GET_USER = `
  query findUser(
    $userId: String!
  ){
    findUser(
      userId: $userId
    ) {
      username
    }
  }
`

export const GET_FOLLOWERS = `
  query getFollowers(
    $userId: String!
  ){
    getFollowers(
      userId: $userId
    ){
      username
    }
  }
`

export const GET_FOLLOWING = `
  query getFollowing(
    $userId: String!
  ){
    getFollowing(
      userId: $userId
    ){
      username
    }
  }
`

export const CREATE_USER = `
  mutation createUser(
    $username: String!, 
    $displayname: String!, 
    $email: String!,
    $password: String!
  ){
    createUser(
      username: $username,
      displayname: $displayname,
      email: $email,
      password: $password
    ) {
      username,
      displayname,
      password,
      email
      userId
    }
  }
`

export const UPDATE_USER = `
  mutation updateUser(
    $username: String!,
    $displayname: String!
  ){
    updateUser(
      username: $username,
      displayname: $displayname
    ){
      username,
      displayname,
      userId,
      email,
      password
    }
  }
`

export const DELETE_USER = `
  mutation deleteUser {
    deleteUser
  }
`

export const FOLLOW_USER = `
  mutation followUser(
    $followUserId: String!
  ){
    followUser(
      followUserId: $followUserId
    )
  }
`

export const UNFOLLOW_USER = `
  mutation unfollowUser(
    $userId: String!
  ){
    unfollowUser(
      userId: $userId
    )
  }
`