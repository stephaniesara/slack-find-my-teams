const sqlite3 = require("sqlite3");

let db = new sqlite3.Database(
  "./appeng_take_home_db",
  sqlite3.OPEN_READONLY,
  err => {
    if (err) {
      console.log(err);
      return;
    }
  }
);

module.exports = db;
