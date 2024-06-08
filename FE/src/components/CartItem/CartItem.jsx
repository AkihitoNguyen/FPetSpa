// eslint-disable-next-line no-unused-vars
import React, { useContext,useEffect } from 'react';
import '../CartItem/CartItem.css';
import { ShopContext } from '../Context/ShopContext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { assets } from "../../assets/assets";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Checkout from '../Checkout/Checkout';

const CartItems = () => {
  const { getTotalCartAmount, products, cartItems, removeFromCart, addToCart } = useContext(ShopContext);
  const isLoggedIn = useSelector((state) => state.auth.login?.currentUser);

  // Lọc các sản phẩm có trong giỏ hàng
  const cartProducts = products.filter(product => cartItems[product.productId] > 0);

  return (
    <div className='cartitems'>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Products</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartProducts.map((product) => (
                  <TableRow
                    key={product.productId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <img src={product.picture} alt={product.productName} className='carticon-product-icon' />
                    </TableCell>
                    <TableCell align="right">{product.productName}</TableCell>
                    <TableCell align="right">${product.price}</TableCell>
                    <TableCell align="right">
                      <div className='cartitems-quantity'>
                        <button onClick={() => addToCart(product.productId, -1)} disabled={cartItems[product.productId] <= 1}>-</button>
                        <span>{cartItems[product.productId]}</span>
                        <button onClick={() => addToCart(product.productId, 1)}>+</button>
                      </div>
                    </TableCell>
                    <TableCell align="right">${product.price * cartItems[product.productId]}</TableCell>
                    <TableCell align="right">
                      <img className='cartitems-remove-icon' src={assets.arrow} onClick={() => removeFromCart(product.productId)} alt="Remove" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={4}>
          <div className="cartitems-down">
            <div className="cartitems-total">
              <h1>Cart Totals</h1>
              <div>
                <div className="cartitems-total-item">
                  <p>Subtotal</p>
                  <p>${getTotalCartAmount()}</p>
                </div>
                <hr />
                <div className="cartitems-total-item">
                  <p>Shipping Fee</p>
                  <p>Free</p>
                </div>
                <hr />
                <div className="cartitems-total-item1">
                  <h3>Total: ${getTotalCartAmount()}</h3>
                </div>
              </div>
              
              <div className='checkout-paypal'>
              {isLoggedIn && <Checkout  getTotalCartAmount={getTotalCartAmount} />}
              </div>
              {isLoggedIn ? (
                
                <Link to="/checkout" className="Btn">
                  Pay
                  <svg className="svgIcon" viewBox="0 0 576 512">
                    <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path>
                  </svg>
                </Link>
                
              ) : (
                <p>
                  Please <Link to="/login" style={{ color: 'red', textDecoration: 'underline' }}>Login</Link> to proceed with payment.
                </p>
              )}
            </div>
           
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default CartItems;
