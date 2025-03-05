import React, { useState, useEffect } from 'react';
import { fetchFromWordPress, queries } from '../lib/wp-client';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const data = await fetchFromWordPress(queries.GET_CATEGORIES);
        
        if (data && data.categories && data.categories.nodes) {
          // Filter out categories with no posts
          const filteredCategories = data.categories.nodes.filter(cat => cat.count > 0);
          setCategories(filteredCategories);
        } else {
          setCategories([]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) return <div className="loading">Loading categories...</div>;
  if (error) return <div className="error">Error loading categories: {error}</div>;
  if (categories.length === 0) return null;

  return (
    <div className="category-list">
      <h3>Categories</h3>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            <a href={`/category/${category.slug}`}>
              {category.name} ({category.count})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
