import React, { useState, useEffect } from 'react';
import { fetchFromWordPress, queries } from '../lib/wp-client';
import PostCard from './PostCard';
import Pagination from './Pagination';
import BlogSidebar from './BlogSidebar';
import './BlogPosts.css';

const BlogPosts = ({ initialSearch = '' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const fetchPosts = async (after = null, search = '') => {
    try {
      const isInitialLoad = !after;
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const variables = { 
        first: 6, 
        after, 
        search
      };

      const data = await fetchFromWordPress(queries.GET_POSTS, variables);
      
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
    fetchPosts(null, searchTerm);
  }, [searchTerm]);

  const handleLoadMore = (endCursor) => {
    fetchPosts(endCursor, searchTerm);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error loading posts: {error}</div>;
  
  return (
    <div className="blog-container">
      <div className="blog-content">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h2>No posts found</h2>
            {searchTerm && (
              <p>No posts match your search for "{searchTerm}". Try a different search term.</p>
            )}
            {!searchTerm && (
              <p>There are no blog posts to display at this time.</p>
            )}
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

export default BlogPosts;
