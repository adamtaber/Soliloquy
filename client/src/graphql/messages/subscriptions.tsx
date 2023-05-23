import { gql } from "../types";

export const MESSAGE_SENT = gql(`
  subscription messageSent{
    messageSent {
      ...MessageFields
    }
  }
`)