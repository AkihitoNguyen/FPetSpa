// eslint-disable-next-line no-unused-vars
import React from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import FirstContent from "../../components/Content/FirstContent";
import SecondContent from "../../components/Content/SecondContent";
import ServiceContent from "../../components/Content/ServiceContent";
import ThirdContent from "../../components/Content/ThirdContent";
import MapComponent from "../../components/Maps/MapComponent";
const Home = () => {
  return (
    <div>
      <Header />
      <ServiceContent />
      <div className="bg-myCusColor">
        <FirstContent />
      </div>
      <SecondContent />
      <ThirdContent />
      <div className="flex justify-center items-center bg-gray-100">
        <MapComponent />
      </div>
    </div>
  );
};

export default Home;
