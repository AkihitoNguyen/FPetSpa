// eslint-disable-next-line no-unused-vars
import React from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import Service from '../../components/Service/Service'
import FirstContent from '../../components/Content/FirstContent'
const Home = () => {
  return (
    <div>
        <Header/>
        <div className='bg-myCusColor '>
        <FirstContent/>
        </div>
        <Service/>
    </div>
  )
}

export default Home