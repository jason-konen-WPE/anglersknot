import { gql } from './apollo-imports.js';

// Query to get the latest posts for the blog page
export const GET_POSTS = gql`
  query GetPosts($first: Int) {
    posts(first: $first) {
      nodes {
        id
        title
        date
        excerpt
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

// Query to get a single post by slug
export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      date
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

// Query to get site information
export const GET_SITE_INFO = gql`
  query GetSiteInfo {
    generalSettings {
      title
      description
    }
  }
`;

// Query to get about page content
export const GET_ABOUT_PAGE = gql`
  query GetAboutPage($slug: ID!) {
    page(id: $slug, idType: SLUG) {
      id
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;
