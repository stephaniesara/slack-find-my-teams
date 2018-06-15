const sqlite3 = require("sqlite3");

// Connect to db
let db = new sqlite3.Database("./appeng_take_home_db", err => {
  if (err) {
    return console.log(err);
  }
});

module.exports = db;
