// eslint-disable-next-line no-unused-vars
import React from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import Service from '../../components/Service/Service'
import BestSeller from '../../components/BestSeller/BestSeller'



const Home = () => {
  return (
    <div>
        <Header/>
        <Service/>
        <BestSeller/>
    </div>
  )
}

export default Home