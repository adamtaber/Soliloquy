import { User } from "../graphql-types"

export const isUser = (input: any): input is User => {
  const user = (input.userId !== undefined) &&
               (input.username !== undefined) &&
               (input.displayname !== undefined) &&
               (input.password !== undefined) &&
               (input.email !== undefined)
  return user
}

export const isUserArray = (input: any): input is Array<User> => {
  const initialLength = input.length

  const filteredArray = input.filter(isUser)
  const filteredLength = filteredArray.length

  return initialLength === filteredLength
}