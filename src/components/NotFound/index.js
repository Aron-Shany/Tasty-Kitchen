import {Link} from 'react-router-dom'
import './index.css'

const NOT_FOUND_IMAGE_URL =
  'https://res.cloudinary.com/tjgkqsq3/image/upload/v1792996996/page_not_found.png'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src={NOT_FOUND_IMAGE_URL}
      alt="not found"
      className="not-found-image"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-text">
      We are sorry, the page you requested could not be found. Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button type="button" className="home-page-button">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
