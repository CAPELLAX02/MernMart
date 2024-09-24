import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

/**
 * Rating component to display a star-based rating system.
 * Displays full stars, half stars, or empty stars based on the `value`.
 *
 * @param {number} value - The rating value, which determines the number of stars (full, half, or empty).
 * @param {string} text - Optional text to display next to the rating (e.g., number of reviews).
 *
 * @returns {JSX.Element} - A star rating display with optional accompanying text.
 */
const Rating = ({ value, text }) => {
  return (
    <div className="rating d-inline-flex align-items-center">
      <span>
        {value >= 1 ? (
          <FaStar color="#ffc500" size={20} />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt color="#ffc500" size={20} />
        ) : (
          <FaRegStar color="#ffc500" size={20} />
        )}
      </span>
      <span>
        {value >= 2 ? (
          <FaStar color="#ffc500" size={20} />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt color="#ffc500" size={20} />
        ) : (
          <FaRegStar color="#ffc500" size={20} />
        )}
      </span>
      <span>
        {value >= 3 ? (
          <FaStar color="#ffc500" size={20} />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt color="#ffc500" size={20} />
        ) : (
          <FaRegStar color="#ffc500" size={20} />
        )}
      </span>
      <span>
        {value >= 4 ? (
          <FaStar color="#ffc500" size={20} />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt color="#ffc500" size={20} />
        ) : (
          <FaRegStar color="#ffc500" size={20} />
        )}
      </span>
      <span>
        {value >= 5 ? (
          <FaStar color="#ffc500" size={20} />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt color="#ffc500" size={20} />
        ) : (
          <FaRegStar color="#ffc500" size={20} />
        )}
      </span>

      <span className="rating-text">{text && text}</span>
    </div>
  );
};

export default Rating;
