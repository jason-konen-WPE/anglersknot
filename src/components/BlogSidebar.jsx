import React from 'react';
import SearchBar from './SearchBar';
import CategoryList from './CategoryList';
import TagList from './TagList';
import '../styles/BlogSidebar.css';

const BlogSidebar = ({ onSearch }) => {
  return (
    <div className="blog-sidebar">
      <SearchBar onSearch={onSearch} />
      <CategoryList />
      <TagList />
    </div>
  );
};

export default BlogSidebar;
