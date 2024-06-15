// eslint-disable-next-line no-unused-vars
import React from 'react'
import { assets } from '../../assets/assets'
const Footer = () => {

    return (
        <div className='flex items-center flex-col text-white'>
            <img src={assets.logo} alt="" className='block w-[124px] h-[124px] mt-14 mb-10'/>
            <h2 className='text-[54px] block leading-[64.8px] mb-6 font-bold'>Level up your inbox</h2>

            <div className='flex gap-4 mb-10'>
                <div>
                    <input type="text" placeholder='Email address*' className=' text-black cursor-text block text-[16px] px-[24px] py-[8px]  font-normal rounded-[2rem] leading-[1.8px]'/>
                </div>
                <div>
                    <button className='border-[1px] rounded-[2rem] bg-white text-[#000000] px-[24px] py-[11.2px] cursor-pointer text-[14px] font-semibold'>Sign Up</button>
                </div>
            </div>

            <div className='flex items-start gap-80 text-start'>
                <div className='flex items-start flex-col bg-cover text-left relative'>
                    <h6 className='pl-8'>Support</h6>
                    <ul className=''>
                        <li className='text-start'>
                            <a href="">FAQs</a>
                        </li>
                        <li>
                            <a href="">Quality Assurance</a>
                        </li>
                        <li>
                            <a href="">Return Policy</a>
                        </li>
                        <li>
                            <a href="">Privacy Policy</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h6 className='pl-8'>Fpet Spa</h6>
                    <ul>
                        <li>
                            <a href="">About Fpet</a>
                        </li>
                        <li>
                            <a href="">Find a Store</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h6 className='pl-8'>Connect</h6>
                    <ul>
                        <li>
                            <a href="">Contact Us</a>
                        </li>
                        <li>
                            <a href="">fpet@gmail.com</a>
                        </li>
                        <li>
                            <div className='w-10 flex gap-4'>
                                <img src={assets.facebook} alt="" className='' />
                                <img src={assets.instagram} alt="" className='' />
                                <img src={assets.email} alt="" className=''/>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer