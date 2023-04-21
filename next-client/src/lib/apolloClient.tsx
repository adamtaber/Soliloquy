import { ApolloClient, InMemoryCache, NormalizedCacheObject, createHttpLink } from '@apollo/client'
import merge from 'deepmerge'
import isEqual from 'lodash.isequal'
import { useMemo } from 'react'

//Majority of this code from NextJS apolloClient example application
//https://github.com/vercel/next.js/blob/canary/examples/with-apollo/lib/apolloClient.js

//Add error handling!!!

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject>

const link = createHttpLink({
  uri: 'http://localhost:3000',
  credentials: 'include'
})

const createApolloClient = () => {
  return new ApolloClient({
    link,
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache()
  })
}

export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient()

  if(initialState) {
    const existingCache = _apolloClient.extract()

    const data = merge(existingCache, initialState, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ]
    })

    _apolloClient.cache.restore(data)
  }

  if(typeof window === 'undefined') return _apolloClient

  if(!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export const addApolloState = (client: ApolloClient<NormalizedCacheObject>, pageProps: any) => {
  if(pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export const useApollo = (pageProps: any) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}