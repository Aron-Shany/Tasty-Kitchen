/* eslint-disable react/no-unknown-property */
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const RestaurantItems = props => {
  const {restaurantDetails} = props
  const {id, name, cuisine, imageUrl} = restaurantDetails
  const {rating, ratingColor, totalReviews} = restaurantDetails
  return (
    <li testid="restaurant-item" className="restaurant-item">
      <Link to={`/restaurant/${id}`} className="restaurant-link">
        <img src={imageUrl} alt="restaurant" className="restaurant-image" />
        <div className="restaurant-info">
          <h1 className="restaurant-name">{name}</h1>
          <p className="restaurant-cuisine">{cuisine}</p>
          <div className="rating-container">
            <AiFillStar style={{color: `#${ratingColor}`}} />
            <p className="rating-value">{rating}</p>
            <p className="rating-count">({totalReviews} ratings)</p>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default RestaurantItems
