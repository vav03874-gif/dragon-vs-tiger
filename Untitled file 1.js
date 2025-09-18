// adjust coins safely
app.post('/game/result', async (req, res) => {
  const { uid, delta } = req.body; // delta can be negative
    const userRef = db.collection('users').doc(uid);
      try {
          await db.runTransaction(async t => {
                const u = await t.get(userRef);
                      const prev = u.exists ? (u.data().coins||0) : 0;
                            const next = prev + delta;
                                  if (next < 0) throw new Error('insufficient');
                                        t.set(userRef, { coins: next }, { merge: true });
                                              const tx = { uid, delta, at: Date.now() };
                                                    const doc = db.collection('gameTx').doc();
                                                          t.set(doc, tx);
                                                              });
                                                                  res.send({ ok: true });
                                                                    } catch (e) {
                                                                        res.status(400).send({ ok:false, error: e.message });
                                                                          }
                                                                          });