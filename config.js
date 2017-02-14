function buildDbUrl() {
  const {
    MONGOLAB_USER,
    MONGOLAB_PASSWORD,
  } = process.env;
  if (MONGOLAB_USER) {
    return `mongodb://${MONGOLAB_USER}:${MONGOLAB_PASSWORD}@ds139705.mlab.com:39705/urlshortener`;
  }
  return 'mongodb://localhost:27017/urlshortener';
}

module.exports = {
  DB_URL: buildDbUrl(),
};
