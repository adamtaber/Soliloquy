import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles.css'
import { ApolloClient, InMemoryCache, 
  ApolloProvider, createHttpLink, split, from } from '@apollo/client'
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { CommentContextProvider } from './CommentContext';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  // if (graphQLErrors)
  //   graphQLErrors.forEach(({ message, locations, path }) => 
  //     console.log(
  //       `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
  //     )
  //   )
  // if (networkError) console.log(`[Network error]: ${networkError}`)
})

const httpLink = createHttpLink({
  uri: 'http://localhost:3000',
  credentials: 'include'
})

const wsLink = new GraphQLWsLink(
  createClient({ url: 'ws://localhost:3000' })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getMessages: {
          merge(existing, incoming) {
            return incoming
          }
        }
      }
    }
  }
})

const client = new ApolloClient({
  cache,
  link: from([errorLink, splitLink])
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <CommentContextProvider>
      <App />
    </CommentContextProvider>
  </ApolloProvider>
)
