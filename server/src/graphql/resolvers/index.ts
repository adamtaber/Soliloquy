import { Resolvers } from "./graphql-types";
import { postMutations, postQueries } from "./post";
import { userQueries, userMutations } from "./user";

const resolvers: Resolvers = {
  Query: {
    ...userQueries,
    ...postQueries
  },
  Mutation: {
    ...userMutations,
    ...postMutations
  }
}

export default resolvers