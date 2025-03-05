import React, { useState, useEffect } from 'react';
import { fetchFromWordPress, queries } from '../lib/wp-client';
import PostCard from './PostCard';
import './FeaturedPosts.css';

const FeaturedPosts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await fetchFromWordPress(queries.GET_POSTS, { first: 3 });
        
        if (data && data.posts) {
          setPosts(data.posts.nodes || []);
        } else {
          setPosts([]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error loading posts: {error}</div>;

  return (
    <section className="featured-posts">
      <div className="container">
        <h2 className="section-title">Latest from the Blog</h2>
        <p className="section-description">Check out our most recent blog posts</p>
        
        {posts.length === 0 ? (
          <div className="no-posts">No posts found.</div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        
        <div className="view-all">
          <a href="/blog" className="btn">View All Posts</a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
