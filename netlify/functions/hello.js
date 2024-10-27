const admin = require('firebase-admin');
const functions = require('firebase-functions');
require('dotenv').config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "loujet-2c6fe",
    clientEmail: "42f072412f1052eadcbcbc52c1ff6cf98f031547",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/9rXHQrU+Clip\nV0e+/bxx24KClIXQ6SWRO9qkVKhTAuqg5KWV+vXQ/PYYaaJh3vjY/Fsq3M9f+fI8\nOLwzgF8bs4fC/ewAsJIKDj1uyZoPo8ucYQAiL0S79dXsqx3ub5LNOlyr5g77ZCq/\nHqdV6LIkraMkcN9DYwmjM4ZpcrKibuCCnP0q03txzC3dV6QSeQ6tMX2ViJYPHdHA\nmL5iGx2rA5toJrcqqknn5+n8viwvivsnVdOIglDY30A57SsfiVHnMt7H5PhsjDfb\njNlqO1ME9GjGIHzHS4jqsZSly1evHKOAqounjXuncS2FRRAZV+JuOM+hqfRLaoHb\nXEESG8pLAgMBAAECggEAVO1u5b3PFqgYKq9ZKBf0/8B4YJIaE9+aRcNfy3VC1RsE\nt/MAiTay+2d27z0I4Nj3anRXV0LConkf4OHO7dAdA9HtPej+OR3lNnqvVizuMn4q\nbkCCAR29gJTWNLNN9je5kH+CEXEibrkVqmGC8eCVs+F4PH6NYDBYSrJYhJ2Ah5jX\nJfE/kspdg7vLwnyHh386FjW+oF3TlZKk3p+qsc2T77T3VhSvywAAVriCfMPgT6kq\nNVDGpDvzqaRDD3FQPmH2ayqTwnNwYIVFuFhldl+1thwCPtPIeQA99lBZBe67VyDZ\nlwaPS+ftep4pk1GAfLlr1WFH/0PZDNmHA2ozyf7eEQKBgQDfE+agPjmBIPMvBJSY\nqy51m+/RgRAXeUFp733EuxkI/vtja/PlNZ4KWk/FSOmNRveScEXd3PjZnWGDtUNO\nK+/zHQ54NJfsTjTWT1ZgUkFxDvWq3r+JWMwmguETuMNAGak0Q11CSAV/qs8GFjRK\nor0fi+XcVXo6z72dOn33jgXOEQKBgQDcS0pPc09fTLMWTbdVF55JC0EOOr3Uwoaz\nTfxx+lGRh0o9Ni86Td889JEgblvU1BZ1YF0SBC1xldLw/16J/XbHa20kJfCjLJ3u\n/Kypx70Z7UGvwaIkvZRSxLaVFKRPa9iDr0lNQQGnDanvcXmn5YJ69C9CWZhTkLFW\n/ot8DGmmmwKBgQDZQdWDzPZOR5vv98MM6PLHggZPgSX95o8JsEBJ4HoiY8rLanDP\nk6eGp6w3FKq5eBtXmFbDHBmUPw2gq2GQeYQovuy/r2EiuIwHCJ+0EYhApvQl5Oif\nyEaTXzX78h7eh99d0hm6mtAYJW+Ymvl0kwgj+Cj2rJztODOQNE5IUh5fMQKBgGIo\nojn4tXtPX9UmV/Rwi7UccKZ4gjGVZBPtQfk/gq0HzYqs5CpknH46s5fx1LVms4Ml\npxLqDZ25Fr8P6v4tlImTUpRy22C59r2QlRcpyxcMYuJ/s1IPr1GaGYkgI37IHTfA\nGTd1KdlX+0qYE48+cv96Yrx706YYqQyMa3agyUrVAoGBAJewikcVAWCz/qyoMgTq\n0WqzoxQPri6mYJfs5/aVZhf8zjkVwY7pTUlwAFHqiPllFqQrrBoBLrZ0azsZ4zTf\nHF68wMBV/ncwsQxq24Hw3LqxbRy5HzrG/GRHBDrKuHJBV/9FPfOfT1XrWEkeUeVJ\ntDSwEWOXJE6f+AvFRozHMjHF\n-----END PRIVATE KEY-----\n",
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
