import { commentMutations, commentQueries } from "./comment";
import { dateScalar } from "./customScalars";
import { Resolvers } from "./graphql-types";
import { postMutations, postQueries } from "./post";
import { userQueries, userMutations } from "./user";

const resolvers: Resolvers = {
  Date: dateScalar,
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