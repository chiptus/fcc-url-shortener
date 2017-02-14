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

function closeDbAndForwardResult(db, closeDb) {
  return (result) => {
    if (closeDb) {
      db.close();
    }
    return result;
  };
}

function insertUrlObject(originalUrl, closeDb = true) {
  return ({ seq, db }) =>
    db.collection('urls')
      .insertOne({
        shortUrlId: seq,
        originalUrl,
      })
      .then(closeDbAndForwardResult(db, closeDb))
      .then(transformDbResult(originalUrl));
}



function findOriginalUrl(urlId, closeDb = true) {
  return db => db.collection('urls')
    .findOne({ shortUrlId: urlId })
    .then(doc => doc.originalUrl)
    .then(closeDbAndForwardResult(db, closeDb));
}

function getUrl(urlId) {
  return MongoClient.connect(DB_URL)
    .then(findOriginalUrl(urlId));
}

function makeNewUrl(originalUrl = '') {
  if (!isValidWebUri(originalUrl)) {
    return Promise.reject(new Error('not valid url'));
  }
  return MongoClient.connect(DB_URL)
    .then(getNextSequenceAndForwardDb)
    .then(insertUrlObject(originalUrl));
}

module.exports = {
  makeNewUrl,
  getUrl,
};
