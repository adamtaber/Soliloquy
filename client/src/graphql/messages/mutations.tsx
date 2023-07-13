import { gql } from "../types";

export const CREATE_MESSAGE = gql(`
  mutation createMessage($receiverId: String!, $content: String!) {
    createMessage(receiverId: $receiverId, content: $content) {
      ...MessageFields
    }
  }
`)

export const DELETE_MESSAGE = gql(`
  mutation deleteMessage($messageId: String!) {
    deleteMessage(messageId: $messageId)
  }
`)