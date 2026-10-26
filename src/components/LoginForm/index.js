import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

const LOGO_URL =
  'https://res.cloudinary.com/tjgkqsq3/image/upload/v1792996319/header_logo.png'
const LOGIN_IMAGE_URL =
  'https://res.cloudinary.com/tjgkqsq3/image/upload/v1792996665/login_img.png'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
    isLoading: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    this.setState({isLoading: true, showError: false})

    const {username, password} = this.state
    const options = {
      method: 'POST',
      body: JSON.stringify({username, password}),
    }

    try {
      const response = await fetch('https://apis.ccbp.in/login', options)
      const data = await response.json()

      if (response.ok) {
        Cookies.set('jwt_token', data.jwt_token, {expires: 30})
        const {history} = this.props
        history.replace('/')
      } else {
        this.setState({
          showError: true,
          errorMsg: data.error_msg,
          isLoading: false,
        })
      }
    } catch (error) {
      this.setState({
        showError: true,
        errorMsg: 'Unable to connect to the server. Please try again.',
        isLoading: false,
      })
    }
  }

  render() {
    const {username, password, showError, errorMsg, isLoading} = this.state

    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login-form-section">
          <form className="login-form" onSubmit={this.onSubmitForm}>
            <img src={LOGO_URL} alt="website logo" className="login-logo" />
            <h1 className="login-heading">Tasty Kitchens</h1>
            <h2 className="login-subheading">Login</h2>

            <label htmlFor="username" className="login-label">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              className="login-input"
              value={username}
              onChange={this.onChangeUsername}
            />

            <label htmlFor="password" className="login-label">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              className="login-input"
              value={password}
              onChange={this.onChangePassword}
            />

            {showError && <p className="error-message">{errorMsg}</p>}

            <button type="submit" className="login-button" disabled={isLoading}>
              Login
            </button>
          </form>
        </div>
        <img
          src={LOGIN_IMAGE_URL}
          alt="website login"
          className="login-image"
        />
      </div>
    )
  }
}

export default LoginForm
