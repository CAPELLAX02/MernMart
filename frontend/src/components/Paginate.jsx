import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Paginate component to handle pagination links dynamically.
 * Works for both user-facing and admin-specific pages.
 *
 * @param {number} pages - Total number of pages.
 * @param {number} page - Current page number.
 * @param {boolean} [isAdmin=false] - If the pagination is for admin pages.
 * @param {string} [keyword=''] - Keyword to be used in search-based pagination.
 *
 * @returns {JSX.Element} - A pagination component with appropriate links.
 */
const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  // Only render pagination if there's more than 1 page
  return (
    pages > 1 && (
      <Pagination className="d-flex justify-content-center mb-5">
        {[...Array(pages).keys()].map((x) => {
          const pageNum = x + 1;

          // Regular user pagination logic
          let link = keyword
            ? `/search/${keyword}/page/${pageNum}` // With search keyword
            : `/page/${pageNum}`; // Without search keyword

          // Admin-specific pagination logic
          if (isAdmin) {
            link = `/admin/productlist/page/${pageNum}`;
          }

          return (
            <Pagination.Item
              as={Link}
              key={pageNum}
              to={link}
              active={pageNum === page}
            >
              {pageNum}
            </Pagination.Item>
          );
        })}
      </Pagination>
    )
  );
};

export default Paginate;
