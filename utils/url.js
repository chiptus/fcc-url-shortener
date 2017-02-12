const { parse } = require('url');

module.exports = {
  isValidWebUri
};

function isValidWebUri(url = '') {
  const urlObj = parse(url);
  return !!urlObj.hostname;
}
