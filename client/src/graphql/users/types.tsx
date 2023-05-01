import { User } from "../types/graphql" 

export const isUser = (input: any): input is User => {
  console.log('test test test')
  console.log(input)
  const user = (input.userId !== undefined) &&
               (input.username !== undefined) &&
               (input.displayname !== undefined) &&
               (input.email !== undefined)
  return user
}