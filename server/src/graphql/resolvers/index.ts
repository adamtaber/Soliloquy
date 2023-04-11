import { Resolvers } from "../../resolvers-types";
import { userQueries, userMutations } from "./user";

const resolvers: Resolvers = {
  Query: {
    ...userQueries
  },
  Mutation: {
    ...userMutations
  }
}

export default resolvers