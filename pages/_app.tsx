import '../styles/globals.css'
import type {AppProps} from 'next/app'

import * as React from 'react';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import dynamic from "next/dynamic";

// GraphQL クライアントを生成
const apolloClient = new ApolloClient({
  uri: '/api/proxy',
  cache: new InMemoryCache(),
  ssrMode: false,
});

const Global = ({Component, pageProps}: AppProps) =>
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>

export default Global
