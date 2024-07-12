// // server.js (or your server file)

// const express = require('express');
// const axios = require('axios');
// const crypto = require('crypto');
// const queryString = require('query-string');

// const app = express();
// const port = process.env.PORT || 3001;

// // VNPay configuration
// const vnp_TmnCode = 'YOUR_TMNCODE';
// const vnp_HashSecret = 'YOUR_HASH_SECRET';
// const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
// const vnp_ReturnUrl = 'http://localhost:3000/vnpay_return';

// app.get('/create_payment_url', (req, res) => {
//   const ipAddr = req.ip;
//   const tmnCode = vnp_TmnCode;
//   const secretKey = vnp_HashSecret;
//   const returnUrl = vnp_ReturnUrl;

//   const date = new Date();
//   const createDate = date.toISOString().slice(0, 19).replace('T', ' ');
//   const orderId = date.getTime().toString();
//   const amount = req.query.amount;
//   const orderInfo = 'Payment for order';
//   const orderType = 'topup';
//   const locale = 'vn';
//   const currCode = 'VND';
//   const vnp_Params = {};

//   vnp_Params['vnp_Version'] = '2.1.0';
//   vnp_Params['vnp_Command'] = 'pay';
//   vnp_Params['vnp_TmnCode'] = tmnCode;
//   vnp_Params['vnp_Locale'] = locale;
//   vnp_Params['vnp_CurrCode'] = currCode;
//   vnp_Params['vnp_TxnRef'] = orderId;
//   vnp_Params['vnp_OrderInfo'] = orderInfo;
//   vnp_Params['vnp_OrderType'] = orderType;
//   vnp_Params['vnp_Amount'] = amount * 100;
//   vnp_Params['vnp_ReturnUrl'] = returnUrl;
//   vnp_Params['vnp_IpAddr'] = ipAddr;
//   vnp_Params['vnp_CreateDate'] = createDate;

//   const sortedParams = Object.keys(vnp_Params).sort().reduce((r, k) => (r[k] = vnp_Params[k], r), {});
//   const signData = queryString.stringify(sortedParams, { encode: false });
//   const hmac = crypto.createHmac("sha512", secretKey);
//   const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
//   vnp_Params['vnp_SecureHash'] = signed;

//   const paymentUrl = `${vnp_Url}?${queryString.stringify(vnp_Params, { encode: true })}`;
//   res.json({ paymentUrl });
// });

// app.get('/vnpay_return', (req, res) => {
//   const vnp_Params = req.query;
//   const secureHash = vnp_Params['vnp_SecureHash'];

//   delete vnp_Params['vnp_SecureHash'];
//   delete vnp_Params['vnp_SecureHashType'];

//   const sortedParams = Object.keys(vnp_Params).sort().reduce((r, k) => (r[k] = vnp_Params[k], r), {});
//   const signData = queryString.stringify(sortedParams, { encode: false });
//   const hmac = crypto.createHmac("sha512", vnp_HashSecret);
//   const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

//   if (secureHash === signed) {
//     // Handle successful payment here
//     res.send('Payment Successful');
//   } else {
//     res.send('Payment Failed');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
