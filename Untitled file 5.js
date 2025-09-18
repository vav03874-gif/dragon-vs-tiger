import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

// Merchant credentials
const MERCHANT_ID = "xxxx";
const MERCHANT_KEY = "yyyy";
const SALT = "zzzz";

// Generate secure signature for PayFast
function generateSignature(data) {
  let pfOutput = "";
    for (let key in data) {
        if (data[key] !== "") {
              pfOutput += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}&`;
                  }
                    }
                      pfOutput = pfOutput.slice(0, -1);
                        return crypto.createHash("sha512").update(pfOutput + SALT).digest("hex");
                        }

                        // Create Payment
                        app.post("/create-payment", (req, res) => {
                          const { amount, userId } = req.body;

                            const data = {
                                merchant_id: MERCHANT_ID,
                                    merchant_key: MERCHANT_KEY,
                                        return_url: "https://yourapp.com/success",
                                            cancel_url: "https://yourapp.com/cancel",
                                                notify_url: "https://yourserver.com/payfast-webhook",
                                                    name_first: "Customer",
                                                        email_address: "test@gmail.com",
                                                            m_payment_id: "order_" + Date.now(),
                                                                amount: amount,
                                                                    item_name: "Coins Purchase",
                                                                      };

                                                                        // Add signature
                                                                          data.signature = generateSignature(data);

                                                                            res.json({
                                                                                url: "https://sandbox.payfast.co.za/eng/process",
                                                                                    data
                                                                                      });
                                                                                      });

                                                                                      // Webhook (Payment Confirmation)
                                                                                      app.post("/payfast-webhook", (req, res) => {
                                                                                        const { m_payment_id, pf_payment_id, payment_status } = req.body;

                                                                                          if (payment_status === "COMPLETE") {
                                                                                              // ✅ Add Coins to user account in DB
                                                                                                  console.log("Payment successful for:", m_payment_id);
                                                                                                    }

                                                                                                      res.sendStatus(200);
                                                                                                      });

                                                                                                      app.listen(5000, () => console.log("Server running on port 5000"));