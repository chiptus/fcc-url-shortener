const { MongoClient, Server } = require('mongodb');




function makeNewUrl(url = '') {
  MongoClient.connect('mongodb://localhost:27017/db', (err, db) => {
    if (err) throw err;
    console.log("connected to mongo");

    db.close();
  });
}


module.exports = {
  makeNewUrl,
};
