import {
  FaPinterestSquare,
  FaInstagram,
  FaTwitter,
  FaFacebookSquare,
} from 'react-icons/fa'
import './index.css'

const FOOTER_LOGO_URL =
  'https://res.cloudinary.com/tjgkqsq3/image/upload/v1792996350/footer_logo.png'

const Footer = () => (
  <footer className="footer-container">
    <div className="footer-logo-container">
      <img
        src={FOOTER_LOGO_URL}
        alt="website-footer-logo"
        className="footer-logo"
      />
      <h1 className="footer-title">Tasty Kitchens</h1>
    </div>
    <p className="footer-description">
      The only thing we are serious about is food. Contact us on
    </p>
    <div className="footer-icons">
      <FaPinterestSquare testid="pintrest-social-icon" />
      <FaInstagram testid="instagram-social-icon" />
      <FaTwitter testid="twitter-social-icon" />
      <FaFacebookSquare testid="facebook-social-icon" />
    </div>
  </footer>
)

export default Footer
