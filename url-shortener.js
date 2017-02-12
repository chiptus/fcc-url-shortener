const { MongoClient } = require('mongodb');
const { DB_URL } = require('./config');
const { getNextSequence } = require('./db-utils');
const { isValidWebUri } = require('./utils/url');

function makeNewUrl(originalUrl = '') {
  if (!isValidWebUri(originalUrl)) {
    return Promise.reject(new Error('not valid url'));
  }
  return MongoClient.connect(DB_URL)
    .then(db =>
      getNextSequence(db)
        .then(seq => ({ seq, db })))
    .then(({ seq, db }) =>
      db.collection('urls')
        .insertOne({
          shortUrlId: seq,
          originalUrl,
        })
    ).then(result => ({
      originalUrl,
      shortUrl: `http://localhost:3000/${result.ops[0].shortUrlId}`,
    }))
    .catch((reason) => {
      console.error(reason);
    });
}

function getUrl(urlId) {
  return MongoClient.connect(DB_URL)
    .then(db => {
      return db.collection('urls')
        .findOne({ shortUrlId: urlId })
        .then(doc => doc.originalUrl)
    });
}

module.exports = {
  makeNewUrl,
  getUrl,
};
