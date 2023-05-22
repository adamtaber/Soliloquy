import { BasicUser, Message } from "../graphql-types"

export const isMessage = (input: any): input is Message  => {
  const message = (input.content !== undefined) &&
                  (input.messageId !== undefined) &&
                  (input.senderId !== undefined) &&
                  (input.receiverId !== undefined) 
  return message
}

export const isMessageArray = (input: any): input is Array<Message> => {
  const initialLength = input.length

  const filteredArray = input.filter(isMessage)
  const filteredLength = filteredArray.length

  return initialLength === filteredLength
}

export const isBasicUser = (input: any): input is BasicUser  => {
  const message = (input.userId !== undefined) &&
                  (input.displayname !== undefined) &&
                  (input.username !== undefined) &&
                  (input.recentMessage !== undefined)
  return message
}

export const isBasicUserArray = (input: any) : input is Array<BasicUser> => {
  const initialLength = input.length

  const filteredArray = input.filter(isBasicUser)
  const filteredLength = filteredArray.length

  return initialLength === filteredLength
}