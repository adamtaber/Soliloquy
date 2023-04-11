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