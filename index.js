const ls = require('./src/ls');
const serialize = require('./src/serialize');
const deserialize = require('./src/deserialize');
const {File, Directory} = require('./src/structures');

module.exports = {
  ls,
  serialize,
  deserialize,
  File,
  Directory
};
