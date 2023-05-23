import { SubscriptionResolvers } from "../graphql-types";
import { pubsub } from "../../../utils";

const messageSubscriptions: SubscriptionResolvers = {
  messageSent: {
    subscribe: () => {
      return {
        [Symbol.asyncIterator]: () => pubsub.asyncIterator('MESSAGE_SENT')
      }
    }
  }
}

export default messageSubscriptions