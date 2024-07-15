// eslint-disable-next-line no-unused-vars
import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <div className='flex flex-col items-center text-white bg-gray-900 py-14'>
            <img src={assets.logo} alt="Logo" className='w-32 h-32 mt-4 mb-6'/>
            <h2 className='text-4xl font-bold mb-4'>Level up your inbox</h2>

            <div className='flex gap-4 mb-8'>
                <input 
                    type="text" 
                    placeholder='Email address*' 
                    className='text-black text-lg px-6 py-3 rounded-full w-64'
                />
                <button className='bg-white text-black px-6 py-3 rounded-full font-semibold'>Sign Up</button>
            </div>

            <div className='flex gap-20 text-left text-sm'>
                <div className='flex flex-col'>
                    <h6 className='text-lg mb-2'>Support</h6>
                    <ul className='space-y-2'>
                        <li><a href="" className='hover:underline'>FAQs</a></li>
                        <li><a href="" className='hover:underline'>Quality Assurance</a></li>
                        <li><a href="" className='hover:underline'>Return Policy</a></li>
                        <li><a href="" className='hover:underline'>Privacy Policy</a></li>
                    </ul>
                </div>
                <div className='flex flex-col'>
                    <h6 className='text-lg mb-2'>Fpet Spa</h6>
                    <ul className='space-y-2'>
                        <li><a href="" className='hover:underline'>About Fpet</a></li>
                        <li><a href="" className='hover:underline'>Find a Store</a></li>
                    </ul>
                </div>
                <div className='flex flex-col'>
                    <h6 className='text-lg mb-2'>Connect</h6>
                    <ul className='space-y-2'>
                        <li><a href="" className='hover:underline'>Contact Us</a></li>
                        <li><a href="mailto:fpet@gmail.com" className='hover:underline'>fpet@gmail.com</a></li>
                        <li className='flex gap-4'>
                            <a href=""><img src={assets.facebook} alt="Facebook" className='w-6 h-6'/></a>
                            <a href=""><img src={assets.instagram} alt="Instagram" className='w-6 h-6'/></a>
                            <a href=""><img src={assets.email} alt="Email" className='w-6 h-6'/></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer