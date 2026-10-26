/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const getCartFromStorage = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('cartData'))
    return Array.isArray(stored) ? stored : []
  } catch (error) {
    return []
  }
}

class RestaurantDetails extends Component {
  state = {
    restaurant: {},
    cartList: getCartFromStorage(),
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRestaurantDetails()
  }

  getRestaurantDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    try {
      const response = await fetch(
        `https://apis.ccbp.in/restaurants-list/${id}`,
        options,
      )
      if (response.ok) {
        const data = await response.json()
        const restaurant = {
          id: data.id,
          name: data.name,
          rating: data.rating,
          costForTwo: data.cost_for_two,
          cuisine: data.cuisine,
          imageUrl: data.image_url,
          reviewsCount: data.reviews_count,
          location: data.location,
          foodItems: data.food_items.map(item => ({
            id: item.id,
            name: item.name,
            cost: item.cost,
            imageUrl: item.image_url,
            rating: item.rating,
          })),
        }
        this.setState({restaurant, apiStatus: apiStatusConstants.success})
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  updateCart = updatedCart => {
    localStorage.setItem('cartData', JSON.stringify(updatedCart))
    this.setState({cartList: updatedCart})
  }

  onAddToCart = foodItem => {
    const {cartList} = this.state
    const newItem = {
      cost: foodItem.cost,
      quantity: 1,
      id: foodItem.id,
      imageUrl: foodItem.imageUrl,
      name: foodItem.name,
    }
    this.updateCart([...cartList, newItem])
  }

  onIncrement = id => {
    const {cartList} = this.state
    const updatedCart = cartList.map(each =>
      each.id === id ? {...each, quantity: each.quantity + 1} : each,
    )
    this.updateCart(updatedCart)
  }

  onDecrement = id => {
    const {cartList} = this.state
    const updatedCart = cartList
      .map(each =>
        each.id === id ? {...each, quantity: each.quantity - 1} : each,
      )
      .filter(each => each.quantity > 0)
    this.updateCart(updatedCart)
  }

  getQuantity = id => {
    const {cartList} = this.state
    const found = cartList.find(each => each.id === id)
    return found ? found.quantity : 0
  }

  renderLoader = () => (
    <div className="loader-container" testid="restaurant-details-loader">
      <Loader type="TailSpin" color="#f7931e" height={50} width={50} />
    </div>
  )

  renderFailure = () => (
    <div className="failure-container">
      <p className="failure-text">Something went wrong. Please try again.</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getRestaurantDetails}
      >
        Retry
      </button>
    </div>
  )

  renderFoodItem = foodItem => {
    const quantity = this.getQuantity(foodItem.id)
    return (
      <li key={foodItem.id} testid="foodItem" className="food-item">
        <img
          src={foodItem.imageUrl}
          alt={foodItem.name}
          className="food-image"
        />
        <div className="food-info">
          <h1 className="food-name">{foodItem.name}</h1>
          <p className="food-cost">
            <span>₹</span> {foodItem.cost}
          </p>
          <div className="food-rating">
            <AiFillStar className="star-icon" />
            <p className="food-rating-value">{foodItem.rating}</p>
          </div>
          {quantity === 0 ? (
            <button
              type="button"
              className="add-button"
              onClick={() => this.onAddToCart(foodItem)}
            >
              Add
            </button>
          ) : (
            <div className="counter-container">
              <button
                type="button"
                className="counter-button"
                testid="decrement-count"
                onClick={() => this.onDecrement(foodItem.id)}
              >
                -
              </button>
              <p className="counter-value" testid="active-count">
                {quantity}
              </p>
              <button
                type="button"
                className="counter-button"
                testid="increment-count"
                onClick={() => this.onIncrement(foodItem.id)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </li>
    )
  }

  renderRestaurant = () => {
    const {restaurant} = this.state
    const {
      name,
      rating,
      costForTwo,
      cuisine,
      imageUrl,
      reviewsCount,
      location,
      foodItems,
    } = restaurant

    return (
      <>
        <div className="restaurant-banner">
          <div className="banner-content">
            <img src={imageUrl} alt="restaurant" className="banner-image" />
            <div className="banner-info">
              <h1 className="banner-name">{name}</h1>
              <p className="banner-cuisine">{cuisine}</p>
              <p className="banner-location">{location}</p>
              <div className="banner-stats">
                <div className="banner-stat">
                  <p className="banner-stat-value">
                    <AiFillStar /> {rating}
                  </p>
                  <p className="banner-stat-label">{reviewsCount}+ Ratings</p>
                </div>
                <div className="banner-divider" />
                <div className="banner-stat">
                  <p className="banner-stat-value">₹ {costForTwo}</p>
                  <p className="banner-stat-label">Cost for two</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul className="food-items-list">
          {foodItems.map(each => this.renderFoodItem(each))}
        </ul>
      </>
    )
  }

  renderContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderRestaurant()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="restaurant-details-container">
          {this.renderContent()}
        </div>
        <Footer />
      </>
    )
  }
}

export default RestaurantDetails
