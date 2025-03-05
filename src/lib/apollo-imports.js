// Import Apollo Client using CommonJS approach
import pkg from '@apollo/client';

// Extract the needed exports
export const ApolloClient = pkg.ApolloClient;
export const InMemoryCache = pkg.InMemoryCache;
export const createHttpLink = pkg.createHttpLink;
export const ApolloProvider = pkg.ApolloProvider;
export const useQuery = pkg.useQuery;

// Import gql from graphql-tag as a fallback
import gqlPkg from 'graphql-tag';
export const gql = gqlPkg.default;
