import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
// import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from 'react-icons/io';

const Rating = ({ value, text }) => {
  return (
    <div className='rating d-inline-flex align-items-center'>
      <span>
        {value >= 1 ? (
          <FaStar color='#ffc500' size={20} />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt color='#ffc500' size={20} />
        ) : (
          <FaRegStar color='#ffc500' size={20} />
        )}
      </span>
      <span>
        {value >= 2 ? (
          <FaStar color='#ffc500' size={20} />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt color='#ffc500' size={20} />
        ) : (
          <FaRegStar color='#ffc500' size={20} />
        )}
      </span>
      <span>
        {value >= 3 ? (
          <FaStar color='#ffc500' size={20} />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt color='#ffc500' size={20} />
        ) : (
          <FaRegStar color='#ffc500' size={20} />
        )}
      </span>
      <span>
        {value >= 4 ? (
          <FaStar color='#ffc500' size={20} />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt color='#ffc500' size={20} />
        ) : (
          <FaRegStar color='#ffc500' size={20} />
        )}
      </span>
      <span>
        {value >= 5 ? (
          <FaStar color='#ffc500' size={20} />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt color='#ffc500' size={20} />
        ) : (
          <FaRegStar color='#ffc500' size={20} />
        )}
      </span>

      <span className='rating-text'>{text && text}</span>
    </div>
  );
};

export default Rating;
