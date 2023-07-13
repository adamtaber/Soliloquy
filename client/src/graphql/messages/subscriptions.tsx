import { gql } from "../types";

export const MESSAGE_SENT = gql(`
  subscription messageSent($receiverId: String!){
    messageSent(receiverId: $receiverId) {
      ...MessageFields
    }
  }
`)

export const MESSAGE_DELETED = gql(`
  subscription messageDeleted($receiverId: String!){
    messageDeleted(receiverId: $receiverId) {
      ...MessageFields
    }
  }
`)