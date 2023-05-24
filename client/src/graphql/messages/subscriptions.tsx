import { gql } from "../types";

export const MESSAGE_SENT = gql(`
  subscription messageSent($receiverId: String!){
    messageSent(receiverId: $receiverId) {
      ...MessageFields
    }
  }
`)