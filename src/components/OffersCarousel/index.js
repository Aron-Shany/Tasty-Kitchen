/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const settings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
}

class OffersCarousel extends Component {
  state = {offersList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getOffers()
  }

  getOffers = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    try {
      const response = await fetch(
        'https://apis.ccbp.in/restaurants-list/offers',
        options,
      )
      if (response.ok) {
        const data = await response.json()
        const offersList = data.offers.map(each => ({
          id: each.id,
          imageUrl: each.image_url,
        }))
        this.setState({offersList, apiStatus: apiStatusConstants.success})
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="restaurants-offers-loader">
      <Loader type="TailSpin" color="#f7931e" height={50} width={50} />
    </div>
  )

  renderOffers = () => {
    const {offersList} = this.state
    return (
      <Slider {...settings}>
        {offersList.map(each => (
          <div key={each.id}>
            <img src={each.imageUrl} alt="offer" className="offer-image" />
          </div>
        ))}
      </Slider>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <p className="failure-text">Unable to load offers</p>
      <button type="button" className="retry-button" onClick={this.getOffers}>
        Retry
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    let content = null
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        content = this.renderLoader()
        break
      case apiStatusConstants.success:
        content = this.renderOffers()
        break
      case apiStatusConstants.failure:
        content = this.renderFailure()
        break
      default:
        content = null
    }
    return <div className="offers-carousel">{content}</div>
  }
}

export default OffersCarousel
