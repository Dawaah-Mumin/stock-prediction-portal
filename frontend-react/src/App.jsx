import { useState } from 'react'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './assets/css/style.css'
import Main from './components/Main'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import AuthProvider from './AuthProvider'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Header/>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
          </Routes>
          <Footer/>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
