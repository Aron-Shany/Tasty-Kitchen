import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const LOGO_URL =
  'https://res.cloudinary.com/tjgkqsq3/image/upload/v1792996319/header_logo.png'

const Header = props => {
  const {location, history} = props
  const {pathname} = location

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <Link to="/" className="nav-logo-link">
        <img src={LOGO_URL} alt="website logo" className="nav-logo" />
        <h1 className="nav-title">Tasty Kitchens</h1>
      </Link>
      <ul className="nav-menu">
        <li>
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/cart"
            className={pathname === '/cart' ? 'nav-link active' : 'nav-link'}
          >
            Cart
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="logout-button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
