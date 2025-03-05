import React from 'react';

const Pagination = ({ hasNextPage, endCursor, onLoadMore, loading }) => {
  if (!hasNextPage) return null;

  return (
    <div className="pagination">
      <button 
        className="load-more-btn" 
        onClick={() => onLoadMore(endCursor)}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load More Posts'}
      </button>
    </div>
  );
};

export default Pagination;
