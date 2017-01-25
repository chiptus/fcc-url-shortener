const express = require('express');
const { makeNewUrl } = require('./url-shortener');

const port = process.env.PORT || 3000;
const app = express();

app.all('/new/:url', (req, res) => {
  makeNewUrl(req.params.url)
    .then(result => console.log(result))
    .catch(err => console.error('er', err))
    .then(() => res.end());
});

app.listen(port, () => {
  console.log(`Listening on port ${3000}`);
});
