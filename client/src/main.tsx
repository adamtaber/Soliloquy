import ReactDOM from 'react-dom/client'
import App from './App'
import { ApolloClient, InMemoryCache, 
  ApolloProvider, createHttpLink, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
