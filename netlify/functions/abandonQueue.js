const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http'); // Use serverless-http to handle serverless requests
const admin = require('firebase-admin');
require('dotenv').config();


admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: 'https://loujet-2c6fe-default-rtdb.europe-west1.firebasedatabase.app/',
});
const app = express();
const db = admin.database();

// Use CORS and JSON middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:58083',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));

// Define your abandonQueue endpoint
app.post('/abandonQueue', async (req, res) => {
  const userId = req.body.userId;
  const destination = req.body.destination;

  try {
    const queueRef = db.ref(`destinations/${destination}/Queue`);
    const nextRgRef = db.ref(`destinations/${destination}/NextRg`);
    const userRef = db.ref(`users/${userId}`);

    const [queueSnapshot, nrsnapshot, userSnapshot] = await Promise.all([
      queueRef.once('value'),
      nextRgRef.once('value'),
      userRef.once('value'),
    ]);

    let queue = queueSnapshot.val();
    let NextRg = nrsnapshot.val();
    let user = userSnapshot.val();
    let me;

    // Adjust the queue data as per your requirements
    for (let key in queue) {
      if (key == userId) me = queue[key];
    }
    for (let key in queue) {
      if (key !== userId && me.rang < queue[key].rang) queue[key].rang -= 1;
    }
    delete user.rang;
    delete user.inQueue;
    delete queue[userId];
    NextRg -= 1;

    // Update Firebase with modified queue data
    await Promise.all([
      queueRef.set(queue),
      nextRgRef.set(NextRg),
      userRef.set(user),
    ]);

    res.status(200).send(queue);
  } catch (error) {
    console.error('Error :', error);
    res.status(500).send('Internal Server Error');
  }
});

// Export the Express app as a Netlify serverless function
module.exports.handler = serverless(app);
