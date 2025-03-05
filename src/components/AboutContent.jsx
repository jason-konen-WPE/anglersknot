import React from 'react';
import './AboutContent.css';

const AboutContent = ({ page }) => {
  const { title, content, featuredImage } = page;
  
  return (
    <div className="about-content">
      <h1 className="about-title">{title}</h1>
      
      {featuredImage?.node && (
        <div className="about-featured-image">
          <img 
            src={featuredImage.node.sourceUrl} 
            alt={featuredImage.node.altText || title} 
          />
        </div>
      )}
      
      <div 
        className="about-body" 
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default AboutContent;
