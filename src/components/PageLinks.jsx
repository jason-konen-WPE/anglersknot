import React, { useState, useEffect } from 'react';
import { fetchFromWordPress, queries } from '../lib/wp-client';

const PageLinks = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        const data = await fetchFromWordPress(queries.GET_ALL_PAGES);
        
        if (data && data.pages) {
          // Filter out the home page and about page
          const filteredPages = data.pages.nodes.filter(page => 
            page.slug !== 'home' && page.slug !== '' && page.slug !== 'about'
          );
          setPages(filteredPages);
        } else {
          setPages([]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchPages();
  }, []);

  if (loading) return null; // Don't show anything while loading
  if (error) return null; // Don't show anything on error

  return (
    <>
      {pages.map(page => (
        <a 
          key={page.id} 
          href={`/page/${page.slug}`} 
          className="nav-link"
          style={{ color: 'var(--dark-color)' }}
        >
          {page.title}
        </a>
      ))}
    </>
  );
};

export default PageLinks;
