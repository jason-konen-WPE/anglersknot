// WordPress GraphQL endpoint
const WORDPRESS_API_URL = 'https://https://anglersknot.wpenginepowered.com/graphql';

/**
 * Fetch data from WordPress GraphQL API
 * @param {string} query - GraphQL query
 * @param {Object} variables - Query variables
 * @returns {Promise<Object>} - Query result
 */
export async function fetchFromWordPress(query, variables = {}) {
  try {
    const response = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors.map(error => error.message).join('\n'));
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching from WordPress:', error);
    return null;
  }
}

// GraphQL queries
export const queries = {
  // Query to get posts with pagination
  GET_POSTS: `
    query GetPosts($first: Int, $after: String, $search: String, $categoryIn: [ID]) {
      posts(first: $first, after: $after, where: { search: $search, categoryIn: $categoryIn }) {
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
              id
              name
              slug
            }
          }
          tags {
            nodes {
              id
              name
              slug
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,

  // Query to get a single post by slug
  GET_POST_BY_SLUG: `
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
  `,

  // Query to get site information
  GET_SITE_INFO: `
    query GetSiteInfo {
      generalSettings {
        title
        description
        url
      }
    }
  `,

  // Query to get page content by slug
  GET_PAGE_BY_SLUG: `
    query GetPageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
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
  `,

  // Query to get all published pages
  GET_ALL_PAGES: `
    query GetAllPages {
      pages(where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          uri
        }
      }
    }
  `,

  // Query to get all categories
  GET_CATEGORIES: `
    query GetCategories {
      categories {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `,

  // Query to get all tags
  GET_TAGS: `
    query GetTags {
      tags {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `,

  // Query to get posts by category
  GET_POSTS_BY_CATEGORY: `
    query GetPostsByCategory($categorySlug: String!, $first: Int, $after: String) {
      category(id: $categorySlug, idType: SLUG) {
        name
        posts(first: $first, after: $after) {
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
                id
                name
                slug
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `,

  // Query to get posts by tag
  GET_POSTS_BY_TAG: `
    query GetPostsByTag($tagSlug: String!, $first: Int, $after: String) {
      tag(id: $tagSlug, idType: SLUG) {
        name
        posts(first: $first, after: $after) {
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
            tags {
              nodes {
                id
                name
                slug
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `
};
