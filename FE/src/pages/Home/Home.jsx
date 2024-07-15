// eslint-disable-next-line no-unused-vars
import React from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import FirstContent from "../../components/Content/FirstContent";
import SecondContent from "../../components/Content/SecondContent";
import ServiceContent from "../../components/Content/ServiceContent";
import ThirdContent from "../../components/Content/ThirdContent";
import MapComponent from "../../components/Maps/MapComponent";
import Video from "../../components/Video";
const Home = () => {
  return (
    <div className="">
      <Video />
      <Header />
      <ServiceContent />
      <FirstContent />
      
      <div className="flex justify-start items-center w-80 bg-gray-100">
        <MapComponent />
      </div>
    </div>
  )
}

export default Home