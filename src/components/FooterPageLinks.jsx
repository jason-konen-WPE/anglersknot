import React, { useState, useEffect } from 'react';
import { fetchFromWordPress, queries } from '../lib/wp-client';

const FooterPageLinks = () => {
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
  if (pages.length === 0) return null; // Don't show anything if no pages

  return (
    <>
      {pages.map(page => (
        <li key={page.id}>
          <a 
            href={`/page/${page.slug}`}
            style={{ color: '#cccccc', textDecoration: 'none', transition: 'color 0.3s ease' }}
            onMouseOver={(e) => e.target.style.color = '#4a6cf7'}
            onMouseOut={(e) => e.target.style.color = '#cccccc'}
          >
            {page.title}
          </a>
        </li>
      ))}
    </>
  );
};

export default FooterPageLinks;
