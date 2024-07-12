
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



ReactDOM.createRoot(document.getElementById('root')).render(

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ShopContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ShopContextProvider>
      </PersistGate>
    </Provider>

);
