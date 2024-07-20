import React from 'react';
import '../components/Loading.css'
const Loading = () => {
  return (
    <div className="w-full gap-x-2 flex justify-center items-center">
      <div
        className="w-5 h-5 bg-[#d991c2] rounded-full custom-pulse-bounce"
      ></div>
      <div
        className="w-5 h-5 bg-[#9869b8] rounded-full custom-pulse-bounce"
      ></div>
      <div
        className="w-5 h-5 bg-[#6756cc] rounded-full custom-pulse-bounce"
      ></div>
    </div>
  );
};

export default Loading;