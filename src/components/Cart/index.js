/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsCheckCircleFill} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const EMPTY_CART_IMAGE_URL =
  'https://res.cloudinary.com/tjgkqsq3/image/upload/v1792996854/empty_cart.png'

const getCartFromStorage = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('cartData'))
    return Array.isArray(stored) ? stored : []
  } catch (error) {
    return []
  }
}

class Cart extends Component {
  state = {cartList: getCartFromStorage(), isPaymentSuccessful: false}

  updateCart = updatedCart => {
    localStorage.setItem('cartData', JSON.stringify(updatedCart))
    this.setState({cartList: updatedCart})
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

  onPlaceOrder = () => {
    localStorage.removeItem('cartData')
    this.setState({cartList: [], isPaymentSuccessful: true})
  }

  renderPaymentSuccess = () => (
    <div className="payment-success-container">
      <BsCheckCircleFill className="payment-success-icon" />
      <h1 className="payment-success-heading">Payment Successful</h1>
      <p className="payment-success-text">
        Thank you for ordering Your payment is successfully completed.
      </p>
      <Link to="/">
        <button type="button" className="go-home-button">
          Go To Home Page
        </button>
      </Link>
    </div>
  )

  renderEmptyCart = () => (
    <div className="empty-cart-container">
      <img
        src={EMPTY_CART_IMAGE_URL}
        alt="empty cart"
        className="empty-cart-image"
      />
      <h1 className="empty-cart-heading">No Order Yet!</h1>
      <p className="empty-cart-text">
        Your cart is empty. Add something from the menu.
      </p>
      <Link to="/">
        <button type="button" className="order-now-button">
          Order Now
        </button>
      </Link>
    </div>
  )

  renderCartItems = () => {
    const {cartList} = this.state
    const totalPrice = cartList.reduce(
      (total, each) => total + each.cost * each.quantity,
      0,
    )

    return (
      <div className="cart-content">
        <ul className="cart-list">
          <li className="cart-list-header">
            <p className="cart-header-text item-column">Item</p>
            <p className="cart-header-text">Quantity</p>
            <p className="cart-header-text">Price</p>
          </li>
          {cartList.map(each => (
            <li key={each.id} className="cart-item" testid="cartItem">
              <div className="cart-item-details item-column">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="cart-item-image"
                />
                <h1 className="cart-item-name">{each.name}</h1>
              </div>
              <div className="cart-counter">
                <button
                  type="button"
                  className="counter-button"
                  testid="decrement-quantity"
                  onClick={() => this.onDecrement(each.id)}
                >
                  -
                </button>
                <p className="counter-value" testid="item-quantity">
                  {each.quantity}
                </p>
                <button
                  type="button"
                  className="counter-button"
                  testid="increment-quantity"
                  onClick={() => this.onIncrement(each.id)}
                >
                  +
                </button>
              </div>
              <p className="cart-item-price">
                ₹ {each.cost * each.quantity}.00
              </p>
            </li>
          ))}
        </ul>
        <hr className="cart-separator" />
        <div className="cart-total-container">
          <h1 className="cart-total-label">Order Total:</h1>
          <p className="cart-total-value" testid="total-price">
            ₹ {totalPrice}.00
          </p>
        </div>
        <div className="place-order-container">
          <button
            type="button"
            className="place-order-button"
            onClick={this.onPlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    )
  }

  renderContent = () => {
    const {cartList, isPaymentSuccessful} = this.state
    if (isPaymentSuccessful) {
      return this.renderPaymentSuccess()
    }
    if (cartList.length === 0) {
      return this.renderEmptyCart()
    }
    return this.renderCartItems()
  }

  render() {
    return (
      <>
        <Header />
        <div className="cart-container">{this.renderContent()}</div>
        <Footer />
      </>
    )
  }
}

export default Cart
