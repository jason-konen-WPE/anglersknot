import React, { useState, useEffect } from 'react';
import { fetchFromWordPress, queries } from '../lib/wp-client';

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        setLoading(true);
        const data = await fetchFromWordPress(queries.GET_TAGS);
        
        if (data && data.tags && data.tags.nodes) {
          // Filter out tags with no posts
          const filteredTags = data.tags.nodes.filter(tag => tag.count > 0);
          setTags(filteredTags);
        } else {
          setTags([]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  if (loading) return <div className="loading">Loading tags...</div>;
  if (error) return <div className="error">Error loading tags: {error}</div>;
  if (tags.length === 0) return null;

  return (
    <div className="tag-list">
      <h3>Tags</h3>
      <div className="tag-cloud">
        {tags.map(tag => (
          <a 
            key={tag.id} 
            href={`/tag/${tag.slug}`}
            className="tag-item"
          >
            {tag.name} ({tag.count})
          </a>
        ))}
      </div>
    </div>
  );
};

export default TagList;
