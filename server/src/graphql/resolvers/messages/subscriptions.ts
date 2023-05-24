import { withFilter } from "graphql-subscriptions"
import { SubscriptionResolvers } from "../graphql-types"
import { pubsub } from "../../../utils"

const messageSubscriptions: SubscriptionResolvers = {
  // messageSent: {
  //   subscribe:
  //     () => {
  //       return {
  //         [Symbol.asyncIterator]: () => pubsub.asyncIterator('MESSAGE_SENT')
  //       }
  //     }
  // }
  messageSent: {
    subscribe:
      (_root, args) => {
        return {
          [Symbol.asyncIterator]: withFilter(
            () => pubsub.asyncIterator('MESSAGE_SENT'),
            (payload) => {
              return (
                payload.messageSent.receiverId === args.receiverId
              )
            }
          )
        }
      }
  }
}

export default messageSubscriptions