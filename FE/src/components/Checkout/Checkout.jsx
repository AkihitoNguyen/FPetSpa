// Checkout.js

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PropTypes from 'prop-types';

const Checkout = ({ getTotalCartAmount, clearCartItems }) => {
  return (
    <PayPalScriptProvider options={{ clientId: "Acu-Lmk731qYDK8sCNwvcy77bP49dVd0VvuNFByVU41LL3m3mdKn8GrSIfGj8H7s-XGHSP-_wg5zmUzs", currency: "USD" }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: getTotalCartAmount(),
                  currency_code: "USD"
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();
          console.log("order", order);
          clearCartItems();
          // Handle order approval
        }}
        onCancel={() => {
          // Handle order cancellation
        }}
        onError={(err) => {
          console.log("PayPal Checkout onError", err);
        }}
      />
    </PayPalScriptProvider>
  );
}

Checkout.propTypes = {
  getTotalCartAmount: PropTypes.func.isRequired,
  clearCartItems: PropTypes.func.isRequired,
};

export default Checkout;
