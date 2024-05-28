import { useEffect,createContext, useState } from "react";
import { getAllServices } from "../api/apiService.js";
import { food_list } from "../assets/assets";
// import { getAllServices } from "../api/apiService.js";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) =>{



    const[cartItems,setCartItems] = useState([]);

    const addTocCart = (itemId) =>{
        if(!cartItems[itemId]){
            setCartItems((prev) =>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
    }

    const removeFromCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId] -1}))
    }

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addTocCart,
        removeFromCart
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
