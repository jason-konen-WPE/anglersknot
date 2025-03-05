import React, { useState, useEffect } from 'react';
import { fetchFromWordPress, queries } from '../lib/wp-client';
import PostCard from './PostCard';
import Pagination from './Pagination';
import BlogSidebar from './BlogSidebar';
import './BlogPosts.css';

const TagPosts = ({ tagSlug }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tag, setTag] = useState(null);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
  const [loadingMore, setLoadingMore] = useState(false);

  // First, fetch the tag info
  const fetchTagInfo = async () => {
    try {
      setLoading(true);
      
      // Get all tags to find the matching one
      const tagsData = await fetchFromWordPress(queries.GET_TAGS);
      
      if (tagsData && tagsData.tags && tagsData.tags.nodes) {
        const matchingTag = tagsData.tags.nodes.find(
          t => t.slug === tagSlug
        );
        
        if (matchingTag) {
          setTag(matchingTag);
          // Now fetch posts for this tag
          await fetchPostsForTag(null, matchingTag.id);
        } else {
          setTag(null);
          setLoading(false);
        }
      } else {
        setTag(null);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching tag info:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Then, fetch posts for the tag
  const fetchPostsForTag = async (after = null, tagId) => {
    try {
      const isInitialLoad = !after;
      if (!isInitialLoad) {
        setLoadingMore(true);
      }

      // For tags, we need to use a custom query since the main GET_POSTS query doesn't support tagIn
      // This is a simplified approach - in a real app, you might want to extend the GET_POSTS query
      const tagPostsQuery = `
        query GetPostsByTag($tagId: ID!, $first: Int, $after: String) {
          posts(where: {tagId: $tagId}, first: $first, after: $after) {
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
      `;

      const variables = { 
        tagId,
        first: 6, 
        after
      };

      console.log("Fetching posts with variables:", variables);
      const data = await fetchFromWordPress(tagPostsQuery, variables);
      console.log("Posts data received:", data);
      
      if (data && data.posts) {
        if (isInitialLoad) {
          setPosts(data.posts.nodes || []);
        } else {
          setPosts(prevPosts => [...prevPosts, ...(data.posts.nodes || [])]);
        }
        setPageInfo(data.posts.pageInfo || { hasNextPage: false, endCursor: null });
      } else {
        if (isInitialLoad) {
          setPosts([]);
        }
        setPageInfo({ hasNextPage: false, endCursor: null });
      }
      
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (tagSlug) {
      fetchTagInfo();
    }
  }, [tagSlug]);

  const handleLoadMore = (endCursor) => {
    if (tag) {
      fetchPostsForTag(endCursor, tag.id);
    }
  };

  const handleSearch = (term) => {
    // Redirect to main blog with search term
    window.location.href = `/blog?search=${encodeURIComponent(term)}`;
  };
  
  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error loading posts: {error}</div>;
  if (!tag) return <div className="error">Tag not found</div>;
  
  return (
    <div className="blog-container">
      <div className="blog-content">
        <div className="tag-header">
          <h1>Tag: {tag.name}</h1>
        </div>
        
        {posts.length === 0 ? (
          <div className="no-posts">
            <h2>No posts found</h2>
            <p>There are no posts with this tag.</p>
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination 
              hasNextPage={pageInfo.hasNextPage} 
              endCursor={pageInfo.endCursor} 
              onLoadMore={handleLoadMore}
              loading={loadingMore}
            />
          </>
        )}
      </div>
      <div className="blog-sidebar-container">
        <BlogSidebar onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default TagPosts;
