import React from 'react'
import { assets } from "../../src/assets/assets";

const Video = () => {
  return (
    <div className="w-fit h-screen">
    {/* Video */}
    <video autoPlay muted loop className="w-full h-auto">
      <source src={assets.Cute_Pet_2} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
  )
}

export default Video