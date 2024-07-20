// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import ShopContextProvider from './components/Context/ShopContext.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='554094266789-iqc14jn9mv9rucu4gdkeuibltsko48t1.apps.googleusercontent.com'>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ShopContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ShopContextProvider>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);
