const express = require('express');
const app = express();
const port = 3000;
const ip = "192.168.1.195";

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port,ip, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
