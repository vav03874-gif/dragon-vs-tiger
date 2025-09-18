// requires: npm i express body-parser cors firebase-admin axios
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// firebase-admin init (use serviceAccountKey.json)
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
  });
  const db = admin.firestore();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // Example: coin packages
  const PACKAGES = {
    small: { coins: 100, price: 1.00 }, // $1 => 100 coins
      medium: { coins: 600, price: 5.00 },
        large: { coins: 1300, price: 10.00 }
        };

        // 1) create payment (returns a redirect url or payment token)
        app.post('/create-payment', async (req, res) => {
          const { uid, pkg } = req.body;
            if (!uid || !PACKAGES[pkg]) return res.status(400).send('Bad request');

              const orderId = 'ord_' + Date.now() + '_' + Math.floor(Math.random()*1000);
                const amount = PACKAGES[pkg].price;

                  // --- HERE: Call real payment gateway API to create a payment session ---
                    // For demo we'll return a fake URL that will call /mock-callback after "payment"
                      const paymentUrl = `${process.env.SERVER_URL}/mock-pay?orderId=${orderId}&uid=${uid}&pkg=${pkg}`;

                        // Save pending transaction
                          await db.collection('transactions').doc(orderId).set({
                              orderId, uid, pkg, amount, status: 'pending', createdAt: Date.now()
                                });

                                  res.json({ paymentUrl, orderId });
                                  });

                                  // 2) endpoint payment webhook (gateway would call this)
                                  app.post('/payment-webhook', async (req, res) => {
                                    // validate signature with gateway (IMPORTANT)
                                      const { orderId, status, gatewayTx } = req.body;
                                        const txDoc = await db.collection('transactions').doc(orderId).get();
                                          if (!txDoc.exists) return res.status(404).send('not found');

                                            const tx = txDoc.data();
                                              if (status === 'success') {
                                                  // credit coins
                                                      const coinsToAdd = PACKAGES[tx.pkg].coins;
                                                          const userRef = db.collection('users').doc(tx.uid);
                                                              await db.runTransaction(async t => {
                                                                    const uDoc = await t.get(userRef);
                                                                          const prev = uDoc.exists ? (uDoc.data().coins || 0) : 0;
                                                                                t.set(userRef, { coins: prev + coinsToAdd }, { merge: true });
                                                                                      t.update(db.collection('transactions').doc(orderId), { status: 'success', gatewayTx, creditedAt: Date.now() });
                                                                                          });
                                                                                            } else {
                                                                                                await db.collection('transactions').doc(orderId).update({ status: 'failed' });
                                                                                                  }
                                                                                                    res.send('ok');
                                                                                                    });

                                                                                                    // MOCK pages for local testing (simulate user paying)
                                                                                                    app.get('/mock-pay', (req, res) => {
                                                                                                      const { orderId, uid, pkg } = req.query;
                                                                                                        // show a web page with "Pay" button that calls webhook
                                                                                                          res.send(`
                                                                                                              <h2>Mock Pay Page</h2>
                                                                                                                  <p>Order: ${orderId} User: ${uid} Package: ${pkg}</p>
                                                                                                                      <form method="post" action="/mock-callback">
                                                                                                                            <input name="orderId" value="${orderId}" hidden />
                                                                                                                                  <input name="uid" value="${uid}" hidden />
                                                                                                                                        <input name="pkg" value="${pkg}" hidden />
                                                                                                                                              <button type="submit" name="status" value="success">Simulate Success</button>
                                                                                                                                                    <button type="submit" name="status" value="failed">Simulate Failed</button>
                                                                                                                                                        </form>
                                                                                                                                                          `);
                                                                                                                                                          });
                                                                                                                                                          app.post('/mock-callback', bodyParser.urlencoded({extended:false}), async (req,res)=>{
                                                                                                                                                            // simulate gateway calling your webhook
                                                                                                                                                              const { orderId, status } = req.body;
                                                                                                                                                                // call internal webhook
                                                                                                                                                                  await axios.post(`${process.env.SERVER_URL}/payment-webhook`, { orderId, status, gatewayTx: 'mockTx123' });
                                                                                                                                                                    res.send('<p>Payment processed. You can close this page.</p>');
                                                                                                                                                                    });

                                                                                                                                                                    const PORT = process.env.PORT || 3000;
                                                                                                                                                                    app.listen(PORT, ()=>console.log('server up', PORT));