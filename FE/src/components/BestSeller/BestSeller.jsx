import React from 'react'
import './BestSeller.css'
import { assets } from '../../assets/assets'
const BestSeller = () => {

    const bestseller = [
        {
            id: 1,
            name: 'Cơm chó',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
            imageAlt: "Front of men's Basic Tee in black.",
            price: '$35',
            color: 'Black',
        },
        // More products...
        {
            id: 1,
            name: 'Cơm chó',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
            imageAlt: "Front of men's Basic Tee in black.",
            price: '$35',
            color: 'Black',
        },
        {
            id: 1,
            name: 'Cơm chó',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
            imageAlt: "Front of men's Basic Tee in black.",
            price: '$35',
            color: 'Black',
        },
        {
            id: 1,
            name: 'Cơm chó',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
            imageAlt: "Front of men's Basic Tee in black.",
            price: '$35',
            color: 'Black',
        },
    ]

    return (
        <div className='bestseller' id='bestseller'>
            <h1>Best <span>Seller</span></h1>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Tempora voluptate labore temporibus suscipit doloribus itaque tempore consectetur expedita, magni iste facere id blanditiis tenetur rerum ipsa dolores iusto unde. Excepturi?</p>
            {bestseller.map((bestseller) => (
                <div className="cart">
                    <div>
                        <img src={assets.food_1}
                            alt={bestseller.imageAlt}
                            className='' />
                    </div>
                    <div className='content'>
                        <h3 className='name'>{bestseller.name}</h3>
                        <p className='price'>{bestseller.price}</p>
                    </div>

                </div>
            ))}
            <div className='blog'>
                <img src={assets.pet_group2} alt="" />

                <div className="blog-content">
                    <h1>We Treat Your Pet
                        <br />As A Family Member
                    </h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing
                        <br /> elit.
                        Magni incidunt optio dolore quibusdam laborum
                        <br /> officia illum perspiciatis in, quidem ipsa<br />
                         debitis ullam? Laboriosam
                         soluta voluptatem</p>
                    <img src={assets.dog_spa} alt="" />
                    <button>Learn More</button>
                </div>
            </div>
        </div>
    )
}

export default BestSeller
