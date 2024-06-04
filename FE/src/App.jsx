// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Login from './pages/Login/Login'
<<<<<<< HEAD
import Service from './pages/Service/Service'
import ContactUs from './pages/ContactUs/ContactUs'
import AboutUs from './pages/AboutUs/AboutUs'

=======
>>>>>>> abfc65b35d26ddc59245c52a27bffd53b0dd3d47

import Service from './components/Service/Service'

const App = () => {

  return (
    <>
      <div className='app'>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/service' element = {<Service/>} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element = {<Login/>}/>
<<<<<<< HEAD
          <Route path='/about-us' element = {<AboutUs/>}/>
          <Route path='/contact-us' element = {<ContactUs/>} />
=======
          <Route path='/signup' element = {<Signup/>}/>
>>>>>>> abfc65b35d26ddc59245c52a27bffd53b0dd3d47
        </Routes>
      </div>
      <Footer />
    </>

  )
}

export default App