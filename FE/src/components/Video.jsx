import React from 'react'
import { assets } from "../../src/assets/assets";

const Video = () => {
  return (
    <div className=" h-[30rem] mb-[45rem]">
    {/* Video */}
    <video autoPlay muted loop className=" h-[7 0rem]">
      <source src={assets.Cute_Pet_2} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
  )
}

export default Video