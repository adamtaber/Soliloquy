import { commentMutations, commentQueries } from "./comment";
import { dateScalar } from "./customScalars";
import { Resolvers } from "./graphql-types";
import { likeMutations, likeQueries } from "./like";
import { messageMutations, messageQueries, messageSubscriptions } from "./message";
import { postMutations, postQueries } from "./post";
import { userQueries, userMutations } from "./user";

const resolvers: Resolvers = {
  Date: dateScalar,
  Query: {
    ...userQueries,
    ...postQueries,
    ...commentQueries,
    ...messageQueries,
    ...likeQueries
  },
  Mutation: {
    ...userMutations,
    ...postMutations,
    ...commentMutations,
    ...messageMutations,
    ...likeMutations
  },
  Subscription: {
    ...messageSubscriptions
  }
}

export default resolvers