import { commentMutations, commentQueries } from "./comment";
import { Resolvers } from "./graphql-types";
import { postMutations, postQueries } from "./post";
import { userQueries, userMutations } from "./user";

const resolvers: Resolvers = {
  Query: {
    ...userQueries,
    ...postQueries,
    ...commentQueries
  },
  Mutation: {
    ...userMutations,
    ...postMutations,
    ...commentMutations
  }
}

export default resolvers