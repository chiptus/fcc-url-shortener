const { MongoClient: { connect } } = require('mongodb');
const { DB_URL } = require('../config');

module.exports = {
  initialDbCall,
  getNextSequence,
};

function initialDbCall() {
  connect(DB_URL)
    .then(
    (db) => {
      const counters = db.collection('counters');
      //adds a new document only if needed
      counters.findAndModify(
        { _id: 'urls' },
        null,
        {
          $setOnInsert: { seq: 0 },
        },
        {
          upsert: true,
        });
    },
    (reason) => {
      console.error(reason);
    });
}

/*
  incremenets the sequence and returns it
*/
function getNextSequence(db, collectionName = 'urls') {
  const counters = db.collection('counters');
  return counters.findAndModify(
    { _id: collectionName },
    null,
    {
      $inc: { seq: 1 },
    },
    {
      new: true,
    })
    .then(({ value: doc }) => doc.seq);
}



