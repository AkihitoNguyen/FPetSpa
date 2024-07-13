// server.js or routes file

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// VNPay configuration
const vnp_TmnCode = 'YOUR_VNP_TMNCODE';
const vnp_HashSecret = 'YOUR_VNP_HASHSECRET';
const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // Use the production URL in production
const vnp_ReturnUrl = 'http://localhost:3000/vnpay_return'; // Your return URL

router.post('/api/vnpay/create_payment', (req, res) => {
  const { amount } = req.body;

  const dateFormat = require('dateformat');
  const tmnCode = vnp_TmnCode;
  const secretKey = vnp_HashSecret;
  const vnpUrl = vnp_Url;
  const returnUrl = vnp_ReturnUrl;
  const orderId = dateFormat(new Date(), 'HHmmss');
  const orderInfo = 'Pay order';
  const orderType = 'topup';
  const locale = 'vn';
  const currCode = 'VND';
  const vnp_Params = {};

  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = amount * 100; // VNPay requires the amount in smallest currency unit
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = req.ip;
  vnp_Params['vnp_CreateDate'] = dateFormat(new Date(), 'yyyymmddHHmmss');

  vnp_Params['vnp_SecureHashType'] = 'SHA256';
  const sortedParams = new URLSearchParams(vnp_Params);
  const signData = `${secretKey}${sortedParams.toString()}`;
  const secureHash = crypto.createHmac('sha256', secretKey).update(signData).digest('hex');
  vnp_Params['vnp_SecureHash'] = secureHash;

  const paymentUrl = `${vnpUrl}?${sortedParams.toString()}&vnp_SecureHash=${secureHash}`;

  res.json({ paymentUrl });
});

// eslint-disable-next-line no-undef
module.exports = router;
