import '../styles/globals.css'
import type {AppProps} from 'next/app'

import * as React from 'react';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {RecoilRoot} from "recoil";

// GraphQL クライアントを生成
const apolloClient = new ApolloClient({
  uri: '/api/proxy',
  cache: new InMemoryCache(),
  ssrMode: false,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Global = ({Component, pageProps}: AppProps) =>
    <ApolloProvider client={apolloClient}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ApolloProvider>

export default Global
