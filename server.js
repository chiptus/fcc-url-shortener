const express = require('express');
const { makeNewUrl, getUrl } = require('./url-shortener');
const { initialDbCall } = require('./utils/db');

const port = process.env.PORT || 3000;
const app = express();

initialDbCall()
  .catch(reason => {
    console.error('error running initial db call', reason);
    process.exit(1);
  });

app.all('/new/*', (req, res) => {
  makeNewUrl(req.params[0])
    .then(result => res.send(result))
    .catch(err => res.send({ error: err.message }))
    .then(() => res.end());
});

app.get('/:urlId', (req, res) => {
  const urlId = +req.params.urlId;
  if (Number.isNaN(urlId)) {
    res.send({ error: 'Need to supply url id' });
    res.end();
    return;
  }
  getUrl(urlId)
    .then(url => res.redirect(url))
    .catch(err => res.end(JSON.stringify(err)));
});



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
