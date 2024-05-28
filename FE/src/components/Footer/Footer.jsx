import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
const Footer = () => {

    const navigate = useNavigate();


    //scrollToTop
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // cuộn mượt
        });
    }

    //reload Homepage

    function reloadPage() {
        window.location.reload();
    }

    return (

        <div className='footer' id='footer'>
            <hr />
            <div className="footer-content">
                <div className="footer-content-left">
                    <img onClick={() => { scrollToTop()}} src={assets.logo} alt="" />
                    <p>Lorem ipsum available, but the majority
                        <br />have suffered alteration in some form.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook} alt=""/>
                        <img src={assets.instagram} alt="" />
                        <img src={assets.email} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Service</li>
                        <li>Product</li>
                        <li>Blog</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+123 456 7890</li>
                        <li>fpet@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="">Copyright 2024 © Fpet.com - All Right Reserved</p>
        </div>
    )
}

export default Footer