// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { getAllUsers } from '../../redux/apiRequest'

// // import Service from '../../components/Service/Service'

// import { loginSuccess } from '../../redux/authSlice'
// import { createAxiosInstance } from '../../createInstance'
const Home = () => {


  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const user = useSelector((state) => state.auth.login?.currentUser);
  // const userList = useSelector((state) => state.users.users?.allUsers);
  // const msg = useSelector((state) => state.users?.msg);
  // let axiosJWT = createAxiosInstance(user, dispatch, loginSuccess);


 

//   useEffect(() => {
//     if (!user) {
//         navigate("/login");
//     }

//     if (user?.accessToken) {
//         getAllUsers(user?.accessToken, dispatch, axiosJWT);
//     }
// }, []);
  return (
    <div>
        <Header/>
        {/* <Service/> */}
    </div>
  )
}

export default Home