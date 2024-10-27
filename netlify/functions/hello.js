const admin = require('firebase-admin');
const functions = require('firebase-functions');
require('dotenv').config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: 'https://loujet-2c6fe-default-rtdb.europe-west1.firebasedatabase.app/'
});

exports.handler = async (event, context) => {
  // Check if the request method is POST
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);
    
    // Here you can interact with the Realtime Database
    const db = admin.database();
    
    // Example: Write to the database
    await db.ref('users/' + body.name).set({
      message: `Hello, ${body.name || 'World'}!`
    });
    
    // Respond with a success message
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Hello, ${body.name || 'World'}!`,
        dbUrl: 'https://loujet-2c6fe-default-rtdb.europe-west1.firebasedatabase.app/'
      }),
    };
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: 'Method Not Allowed'
      }),
    };
  }
};
