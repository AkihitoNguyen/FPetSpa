// eslint-disable-next-line no-unused-vars
    import React from 'react'
import '../Product/Product.css'
    import { assets } from '../../assets/assets'
    import Breadcrum from '../../components/Breadcrum/Breadcrum'
    import ShopSideNav from '../../components/ProductPage/ShopSideNav'
    const Product = () => {
    return (
<div>
    <div className='product-banner'>
        <img src={assets.banner}/>
    </div>
    <Breadcrum/>
    
    <ShopSideNav/>
    
</div>
    )
    }

    export default Product
