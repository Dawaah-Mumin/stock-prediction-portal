import React from 'react'
import Button from './Button'
import Header from './Header'
import Footer from './Footer'
import { AuthContext } from '../AuthProvider'

const Main = () => {

  const isLoggedIn = localStorage.getItem('access_token') ? true : false;

  return (
    <>
      <div className='container'>
        <div className='p-5 text-center bg-light-dark rounded'>
          <h1 className='text-light'>Stock Prediction Portal</h1>
          <p className='text-light lead'>This is a stock prediction portal that uses machine learning algorithms to predict the stock prices of various companies. The portal provides a user-friendly interface for users to input their stock data and receive predictions based on historical data and trends.
          </p>
          { isLoggedIn ? (
            <Button text= 'Explore Dashboard' class = 'btn-outline-info' url='/dashboard'/>
          ):(
            <Button text= 'Login' class = 'btn-outline-info' url='/login'/>
          )}

        </div>
      </div>
    </>
  )
}

export default Main