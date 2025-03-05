# Angler's Knot - Headless WordPress with Astro and React

A modern headless WordPress website built with Astro.js and React, interfacing with WordPress through WP GraphQL.

## Features

- **Server-Side Rendering**: Dynamic routes with SSR for optimal performance
- **WordPress Integration**: Fetches content from WordPress via GraphQL
- **Modern Frontend**: Built with Astro.js and React components
- **Blog Features**:
  - Pagination with "Load More" functionality
  - Search capability
  - Category and tag filtering
  - Responsive design

## Pages

- **Home**: Landing page with hero section
- **Blog**: Displays posts from WordPress with search and filtering
- **Blog Post**: Individual post pages with full content
- **About**: About page content from WordPress
- **Categories/Tags**: Browse posts by category or tag
- **Dynamic Pages**: Any page created in WordPress is automatically available

## Technical Stack

- **Astro.js**: For static site generation with dynamic islands
- **React**: For interactive components
- **WordPress**: As a headless CMS
- **WP GraphQL**: For querying WordPress content
- **Node.js**: For server-side rendering

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/jasonkonen/anglersknot.git
   cd anglersknot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

## WordPress Setup

This project requires a WordPress installation with the following plugins:
- WP GraphQL
- WP GraphQL for Advanced Custom Fields (if using ACF)

## Configuration

The WordPress GraphQL endpoint is configured in `src/lib/wp-client.js`.
