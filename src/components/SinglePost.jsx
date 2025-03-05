import React, { useState, useEffect } from 'react';
import { fetchFromWordPress, queries } from '../lib/wp-client';
import PostContent from './PostContent';
import './SinglePost.css';

const SinglePost = ({ slug }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const data = await fetchFromWordPress(queries.GET_POST_BY_SLUG, { slug });
        
        if (data && data.post) {
          setPost(data.post);
        } else {
          setPost(null);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);
  
  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">Error loading post: {error}</div>;
  
  if (!post) return <div className="not-found">Post not found</div>;
  
  return <PostContent post={post} />;
};

export default SinglePost;
