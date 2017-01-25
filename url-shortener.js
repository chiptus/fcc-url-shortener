const { MongoClient } = require('mongodb');
const { DB_URL } = require('./config');


function makeNewUrl(url = '') {
  if (!url) {
    return Promise.reject({ error: "no url" });
  }
  return MongoClient.connect(DB_URL)
    .then((db) => {
      const coll = db.collection('urls');
      return new Promise(
        (res, rej) => {
          coll.insertOne({
            url,
            key: '$inc',
          }, (err, data) => {
            if (err) rej({ error: err });
            db.close();
            res("suc");
          });
        });
    });
}


module.exports = {
  makeNewUrl,
};
