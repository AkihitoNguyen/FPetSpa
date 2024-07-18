// eslint-disable-next-line no-unused-vars
import React from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import FirstContent from '../../components/Content/FirstContent'
import SecondContent from '../../components/Content/SecondContent'
import ServiceContent from '../../components/Content/ServiceContent'
import ThirdContent from '../../components/Content/ThirdContent'
import Video from '../../components/Video'
const Home = () => {
  return (
    // <div>
    //     <Header/>
    //     <ServiceContent/>
    //     <div className='bg-myCusColor'>
    //     <FirstContent/>
    //     </div>
    //     <SecondContent/>
    //     <ThirdContent/>
    // </div>
    <div>
      <Video/>
    </div>
  )
}

export default Home