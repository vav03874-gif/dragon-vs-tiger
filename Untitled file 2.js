// Easypaisa API call (pseudo-code)
const response = await axios.post('https://easypay.easypaisa.com.pk/api/payment', {
  merchantId: process.env.MERCHANT_ID,
    amount: 100,
      orderRefNum: 'ord123',
        returnUrl: 'https://your-server.com/payment-callback'
        }, { headers: { Authorization: 'Bearer ...' }});