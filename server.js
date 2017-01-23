const express = require('express');
const { makeNewUrl } = require('./url-shortener');
const port = process.env.PORT || 3000;
const app = express();

app.all('/new/:url', (req, res) => {
  res.end(makeNewUrl(req.params.url));
});

app.listen(port, () => {
  console.log(`Listening on port ${3000}`);
});
