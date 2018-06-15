const Promise = require("bluebird");
const sqlite3 = Promise.promisifyAll(require("sqlite3"));

let db = new sqlite3.Database("./appeng_take_home_db", err => {
  if (err) {
    return console.log(err);
  } else {
    console.log("db open");
  }
});

module.exports = db;
