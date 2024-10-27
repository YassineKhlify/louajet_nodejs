exports.handler = async (event, context) => {
    // Check if the request method is POST
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      
      // Respond with a simple message
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Hello, ${body.name || 'World'}!`
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
  