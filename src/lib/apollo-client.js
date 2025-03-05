import { ApolloClient, InMemoryCache, createHttpLink } from './apollo-imports.js';

// WordPress GraphQL endpoint
const WORDPRESS_API_URL = 'https://anglersknot.com/graphql';

const httpLink = createHttpLink({
  uri: WORDPRESS_API_URL,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
