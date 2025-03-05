import React from 'react';
import './PostContent.css';

const PostContent = ({ post }) => {
  const { title, content, featuredImage, date, categories } = post;
  
  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <article className="post-full">
      <header className="post-header">
        {categories?.nodes?.length > 0 && (
          <div className="post-categories">
            {categories.nodes.map((category, index) => (
              <span key={index} className="category">
                {category.name}
              </span>
            ))}
          </div>
        )}
        <h1 className="post-title">{title}</h1>
        <div className="post-meta">
          <span className="post-date">{formattedDate}</span>
        </div>
      </header>
      
      {featuredImage?.node && (
        <div className="post-featured-image">
          <img 
            src={featuredImage.node.sourceUrl} 
            alt={featuredImage.node.altText || title} 
          />
        </div>
      )}
      
      <div 
        className="post-content" 
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
};

export default PostContent;
