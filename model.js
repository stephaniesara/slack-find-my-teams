const db = require("./db");
const { sortBy } = require("underscore");

class UserModel {
  getJoinedTeams(email, cb) {
    const query =
      "SELECT teams.name, teams.id FROM teams INNER JOIN users\
      WHERE users.email = ? and teams.id = users.team_id";
    db.all(query, [email], (err, rows) => {
      cb(err, rows);
    });
  }

  getEligibleTeams(email, domain, cb) {
    let query =
      "SELECT name, id FROM teams WHERE email_domain like ?\
      AND id not in (SELECT team_id FROM users WHERE email = ?)";
    db.all(query, [domain, email], (err, rows) => {
      if (err) return cb(err, null);
      let numRows = rows.length;
      let count = 0;

      rows.forEach(row => {
        query = "SELECT count(*) from users where team_id = ?";
        db.get(query, [row.id], (err, result) => {
          if (err) return cb(err, null);
          row.count = result["count(*)"];
          count++;
          if (count === numRows) {
            cb(null, sortBy(rows, "count").reverse());
          }
        });
      });
    });
  }
}

module.exports = new UserModel();
