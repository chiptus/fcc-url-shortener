const express = require('express');
const { makeNewUrl, getUrl } = require('./url-shortener');
const { initialDbCall } = require('./db-utils');

const port = process.env.PORT || 3000;
const app = express();

initialDbCall();

app.get('/:urlId', (req, res) => {
  getUrl(+req.params.urlId)
    .then(url => res.redirect(url));
});

app.all('/new/*', (req, res) => {
  makeNewUrl(req.params[0])
    .then(result => res.send(result))
    .catch(err => res.send({ error: err.message }))
    .then(() => res.end());
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
