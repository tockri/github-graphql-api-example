import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { CssBaseline } from '@mui/material'
import type { AppProps } from 'next/app'
import * as React from 'react'
import { RecoilRoot } from 'recoil'

// GraphQL クライアントを生成
const apolloClient = new ApolloClient({
  uri: '/api/proxy',
  cache: new InMemoryCache(),
  ssrMode: false,
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Global = ({ Component, pageProps }: AppProps) => (
  <ApolloProvider client={apolloClient}>
    <RecoilRoot>
      <CssBaseline />
      <Component {...pageProps} />
    </RecoilRoot>
  </ApolloProvider>
)

export default Global
