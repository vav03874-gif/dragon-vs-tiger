import React from "react";
import { View, Button } from "react-native";

export default function Shop() {
  const buyCoins = async (amount) => {
      let res = await fetch("http://your-server.com/create-payment", {
            method: "POST",
                  headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ amount, userId: "user123" }),
                            });
                                let { url, data } = await res.json();

                                    // Redirect user to PayFast payment page
                                        const paymentUrl = `${url}?${Object.keys(data)
                                              .map(k => `${k}=${encodeURIComponent(data[k])}`)
                                                    .join("&")}`;

                                                        // Open in WebView or Browser
                                                            Linking.openURL(paymentUrl);
                                                              };

                                                                return (
                                                                    <View>
                                                                          <Button title="Buy 100 Coins (PKR 100)" onPress={() => buyCoins(100)} />
                                                                                <Button title="Buy 500 Coins (PKR 500)" onPress={() => buyCoins(500)} />
                                                                                    </View>
                                                                                      );
                                                                                      }