import React from 'react';
import '../styles/PostCard.css';

const PostCard = ({ post }) => {
  const { title, excerpt, featuredImage, date, slug, categories } = post;
  
  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="post-card">
      {featuredImage?.node && (
        <div className="post-image">
          <a href={`/blog/${slug}`}>
            <img 
              src={featuredImage.node.sourceUrl} 
              alt={featuredImage.node.altText || title} 
            />
          </a>
        </div>
      )}
      <div className="post-content">
        {categories?.nodes?.length > 0 && (
          <div className="post-categories">
            {categories.nodes.map((category, index) => (
              <span key={index} className="category">
                {category.name}
              </span>
            ))}
          </div>
        )}
        <h2 className="post-title">
          <a href={`/blog/${slug}`}>{title}</a>
        </h2>
        <div className="post-meta">
          <span className="post-date">{formattedDate}</span>
        </div>
        <div 
          className="post-excerpt" 
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
        <a href={`/blog/${slug}`} className="read-more">
          Read More
        </a>
      </div>
    </div>
  );
};

export default PostCard;
