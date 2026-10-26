/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {
  BsFilterLeft,
  BsSearch,
  BsChevronLeft,
  BsChevronRight,
} from 'react-icons/bs'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'
import Footer from '../Footer'
import OffersCarousel from '../OffersCarousel'
import RestaurantItems from '../RestaurantItems'
import './index.css'

const sortByOptions = [
  {id: 0, displayText: 'Highest', value: 'Highest'},
  {id: 2, displayText: 'Lowest', value: 'Lowest'},
]

const LIMIT = 9

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    restaurantsList: [],
    totalRestaurants: 0,
    activePage: 1,
    selectedSortBy: 'Lowest',
    searchInput: '',
    searchQuery: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRestaurants()
  }

  getRestaurants = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activePage, selectedSortBy, searchQuery} = this.state
    const offset = (activePage - 1) * LIMIT
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/restaurants-list?search=${searchQuery}&offset=${offset}&limit=${LIMIT}&sort_by_rating=${selectedSortBy}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const restaurants = data.restaurants || []
        const restaurantsList = restaurants.map(each => ({
          id: each.id,
          name: each.name,
          cuisine: each.cuisine,
          imageUrl: each.image_url,
          rating: each.user_rating.rating,
          ratingColor: each.user_rating.rating_color,
          totalReviews: each.user_rating.total_reviews,
        }))
        this.setState({
          restaurantsList,
          totalRestaurants: data.total || 0,
          apiStatus: apiStatusConstants.success,
        })
      } else if (searchQuery !== '') {
        this.setState({
          restaurantsList: [],
          totalRestaurants: 0,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSortBy = event => {
    this.setState(
      {selectedSortBy: event.target.value, activePage: 1},
      this.getRestaurants,
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearch = event => {
    event.preventDefault()
    const {searchInput} = this.state
    this.setState(
      {searchQuery: searchInput, activePage: 1},
      this.getRestaurants,
    )
  }

  onClickLeftPage = () => {
    const {activePage} = this.state
    if (activePage > 1) {
      this.setState({activePage: activePage - 1}, this.getRestaurants)
    }
  }

  onClickRightPage = () => {
    const {activePage, totalRestaurants} = this.state
    const totalPages = Math.ceil(totalRestaurants / LIMIT)
    if (activePage < totalPages) {
      this.setState({activePage: activePage + 1}, this.getRestaurants)
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="restaurants-list-loader">
      <Loader type="TailSpin" color="#f7931e" height={50} width={50} />
    </div>
  )

  renderRestaurantsList = () => {
    const {restaurantsList, activePage, totalRestaurants} = this.state
    const totalPages = Math.ceil(totalRestaurants / LIMIT)

    if (restaurantsList.length === 0) {
      return (
        <div className="failure-container">
          <p className="failure-text">
            No restaurants found. Try another search.
          </p>
        </div>
      )
    }

    return (
      <>
        <ul className="restaurants-list">
          {restaurantsList.map(each => (
            <RestaurantItems key={each.id} restaurantDetails={each} />
          ))}
        </ul>
        <div className="pagination-container">
          <button
            type="button"
            className="pagination-button"
            testid="pagination-left-button"
            onClick={this.onClickLeftPage}
          >
            <BsChevronLeft />
          </button>
          <p className="pagination-text">
            <span testid="active-page-number">{activePage}</span> of{' '}
            {totalPages}
          </p>
          <button
            type="button"
            className="pagination-button"
            testid="pagination-right-button"
            onClick={this.onClickRightPage}
          >
            <BsChevronRight />
          </button>
        </div>
      </>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <p className="failure-text">Something went wrong. Please try again.</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getRestaurants}
      >
        Retry
      </button>
    </div>
  )

  renderContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderRestaurantsList()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {selectedSortBy, searchInput} = this.state

    return (
      <>
        <Header />
        <div className="home-container">
          <OffersCarousel />
          <h1 className="popular-heading">Popular Restaurants</h1>
          <p className="popular-description">
            Select Your favourite restaurant special dish and make your day
            happy...
          </p>
          <div className="filters-container">
            <form className="search-form" onSubmit={this.onSubmitSearch}>
              <input
                type="search"
                className="search-input"
                placeholder="Search restaurant"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="submit"
                className="search-button"
                aria-label="search"
              >
                <BsSearch />
              </button>
            </form>
            <div className="sort-container">
              <BsFilterLeft className="sort-icon" />
              <p className="sort-text">Sort By</p>
              <select
                className="sort-select"
                value={selectedSortBy}
                onChange={this.onChangeSortBy}
              >
                {sortByOptions.map(option => (
                  <option key={option.id} value={option.value}>
                    {option.displayText}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <hr className="separator" />
          {this.renderContent()}
        </div>
        <Footer />
      </>
    )
  }
}

export default Home
