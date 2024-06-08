import React, { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Login from './pages/Login/Login'
import Service from './pages/Service/Service'
import ContactUs from './pages/ContactUs/ContactUs'
import AboutUs from './pages/AboutUs/AboutUs'



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
          <Route path='/about-us' element = {<AboutUs/>}/>
          <Route path='/contact-us' element = {<ContactUs/>} />
        </Routes>
      </div>
      <Footer />
    </>

  )
}

export default App