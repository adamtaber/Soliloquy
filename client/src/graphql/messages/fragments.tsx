import { gql } from "../types";

export const MessageFragment = gql(`
  fragment MessageFields on Message {
    messageId
    senderId
    senderName
    receiverId
    content
    createdOn
  }
`)