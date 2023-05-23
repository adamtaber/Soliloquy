import { commentMutations, commentQueries } from "./comment";
import { dateScalar } from "./customScalars";
import { Resolvers } from "./graphql-types";
import { messageMutations, messageQueries, messageSubscriptions } from "./messages";
import { postMutations, postQueries } from "./post";
import { userQueries, userMutations } from "./user";

const resolvers: Resolvers = {
  Date: dateScalar,
  Query: {
    ...userQueries,
    ...postQueries,
    ...commentQueries,
    ...messageQueries
  },
  Mutation: {
    ...userMutations,
    ...postMutations,
    ...commentMutations,
    ...messageMutations
  },
  Subscription: {
    ...messageSubscriptions
  }
}

export default resolvers