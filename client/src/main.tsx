import ReactDOM from 'react-dom/client'
import App from './App'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'

const link = createHttpLink({
  uri: 'http://localhost:3000',
  credentials: 'include'
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
