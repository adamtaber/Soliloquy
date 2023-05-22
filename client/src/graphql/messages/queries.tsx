import { gql } from "../types";


export const GET_MESSAGES = gql(`
  query getMessages($messagePartnerId: String!) {
    getMessages(messagePartnerId: $messagePartnerId) {
      ...MessageFields
    }
  }
`)

export const GET_MESSAGE_PARTNERS = gql(`
  query getMessagePartners {
    getMessagePartners {
      userId
      username
      displayname
      recentMessage
    }
  }
`)