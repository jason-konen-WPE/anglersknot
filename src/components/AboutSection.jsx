import React, { useState, useEffect } from 'react';
import { fetchFromWordPress, queries } from '../lib/wp-client';
import AboutContent from './AboutContent';
import './AboutSection.css';

const AboutSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(null);

  useEffect(() => {
    async function fetchAboutPage() {
      try {
        setLoading(true);
        const data = await fetchFromWordPress(queries.GET_PAGE_BY_SLUG, { slug: 'about' });
        
        if (data && data.page) {
          setPage(data.page);
        } else {
          setPage(null);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchAboutPage();
  }, []);
  
  if (loading) return <div className="loading">Loading about page...</div>;
  if (error) return <div className="error">Error loading about page: {error}</div>;
  
  if (!page) {
    // Fallback content if the about page doesn't exist in WordPress
    return (
      <div className="about-fallback">
        <h2>About Me</h2>
        <p>
          This is a placeholder about page. In a real implementation, this content would come from WordPress.
          You can create an "About" page in your WordPress admin to replace this content.
        </p>
        <p>
          This headless WordPress site is built with Astro.js and React, using WP GraphQL to fetch content from WordPress.
        </p>
      </div>
    );
  }
  
  return <AboutContent page={page} />;
};

export default AboutSection;
