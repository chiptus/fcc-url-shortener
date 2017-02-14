const { MongoClient } = require('mongodb');
const { DB_URL } = require('./config');
const { getNextSequence } = require('./utils/db');
const { isValidWebUri } = require('./utils/url');

function getNextSequenceAndForwardDb(db) {
  return getNextSequence(db)
    .then(seq => ({ seq, db }));
}

function transformDbResult(originalUrl) {
  return result => ({
    originalUrl,
    shortUrl: `http://localhost:3000/${result.ops[0].shortUrlId}`,
  });
}

function insertUrlObject(originalUrl) {
  return ({ seq, db }) =>
    db.collection('urls')
      .insertOne({
        shortUrlId: seq,
        originalUrl,
      })
      .then(transformDbResult(originalUrl));
}


function makeNewUrl(originalUrl = '') {
  if (!isValidWebUri(originalUrl)) {
    return Promise.reject(new Error('not valid url'));
  }
  return MongoClient.connect(DB_URL)
    .then(getNextSequenceAndForwardDb)
    .then(insertUrlObject(originalUrl))
    .catch((reason) => {
      console.error(reason);
    });
}

function findOriginalUrl(urlId) {
  return db => db.collection('urls')
    .findOne({ shortUrlId: urlId })
    .then(doc => doc.originalUrl);
}

function getUrl(urlId) {
  return MongoClient.connect(DB_URL)
    .then(findOriginalUrl(urlId));
}

module.exports = {
  makeNewUrl,
  getUrl,
};
