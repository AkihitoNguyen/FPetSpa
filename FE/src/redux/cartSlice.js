import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Add to cart thunk
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const { login } = auth;
    const { currentUser } = login;
    const userId = currentUser?.id;

    try {
      await axios.post('https://localhost:7055/api/Cart/', {
        userId,
        productId,
        quantity,
      });
      return { productId, quantity }; // Return the productId and quantity to update the state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Remove from cart thunk
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async ({ productId }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const { login } = auth;
    const { currentUser } = login;
    const userId = currentUser?.id;

    try {
      await axios.delete('https://localhost:7055/api/Cart/{id}', {
        data: {
          userId,
          productId,
        }
      });
      return { productId }; // Return the productId to update the state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
      cartItems: {},
      status: null,
      error: null,
    },
    reducers: {
      setCartItems: (state, action) => {
        state.cartItems = action.payload;
      },
      addToCart: (_state, _action) => {
        // Implement addToCart reducer logic here if needed
      },
      removeFromCart: (_state, _action) => {
        // Implement removeFromCart reducer logic here if needed
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(addToCartAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(addToCartAsync.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const { productId, quantity } = action.payload;
          state.cartItems[productId] = (state.cartItems[productId] || 0) + quantity;
        })
        .addCase(addToCartAsync.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(removeFromCartAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(removeFromCartAsync.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const { productId } = action.payload;
          delete state.cartItems[productId];
        })
        .addCase(removeFromCartAsync.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    },
  });
  
  

export const { setCartItems, addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
