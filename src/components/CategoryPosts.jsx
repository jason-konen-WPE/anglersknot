import React, { useState, useEffect } from 'react';
import { fetchFromWordPress, queries } from '../lib/wp-client';
import PostCard from './PostCard';
import Pagination from './Pagination';
import BlogSidebar from './BlogSidebar';
import './BlogPosts.css';

const CategoryPosts = ({ categorySlug }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
  const [loadingMore, setLoadingMore] = useState(false);

  // First, fetch the category info
  const fetchCategoryInfo = async () => {
    try {
      setLoading(true);
      
      // Get all categories to find the matching one
      const categoriesData = await fetchFromWordPress(queries.GET_CATEGORIES);
      
      if (categoriesData && categoriesData.categories && categoriesData.categories.nodes) {
        const matchingCategory = categoriesData.categories.nodes.find(
          cat => cat.slug === categorySlug
        );
        
        if (matchingCategory) {
          setCategory(matchingCategory);
          // Now fetch posts for this category
          await fetchPostsForCategory(null, matchingCategory.id);
        } else {
          setCategory(null);
          setLoading(false);
        }
      } else {
        setCategory(null);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching category info:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Then, fetch posts for the category
  const fetchPostsForCategory = async (after = null, categoryId) => {
    try {
      const isInitialLoad = !after;
      if (!isInitialLoad) {
        setLoadingMore(true);
      }

      const variables = { 
        first: 6, 
        after,
        categoryIn: [categoryId]
      };

      console.log("Fetching posts with variables:", variables);
      const data = await fetchFromWordPress(queries.GET_POSTS, variables);
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
    if (categorySlug) {
      fetchCategoryInfo();
    }
  }, [categorySlug]);

  const handleLoadMore = (endCursor) => {
    if (category) {
      fetchPostsForCategory(endCursor, category.id);
    }
  };

  const handleSearch = (term) => {
    // Redirect to main blog with search term
    window.location.href = `/blog?search=${encodeURIComponent(term)}`;
  };
  
  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error loading posts: {error}</div>;
  if (!category) return <div className="error">Category not found</div>;
  
  return (
    <div className="blog-container">
      <div className="blog-content">
        <div className="category-header">
          <h1>Category: {category.name}</h1>
        </div>
        
        {posts.length === 0 ? (
          <div className="no-posts">
            <h2>No posts found</h2>
            <p>There are no posts in this category.</p>
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

export default CategoryPosts;
