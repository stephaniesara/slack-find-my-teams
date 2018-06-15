const db = require("./db");
const { sortBy } = require("underscore");

class UserModel {
  // Get a list of teams the user has already joined
  getJoinedTeams(email, cb) {
    const query =
      "SELECT teams.name, teams.id FROM teams INNER JOIN users\
      WHERE users.email = ? and teams.id = users.team_id";
    db.all(query, [email], (err, rows) => {
      cb(err, rows);
    });
  }

  // Get a list of teams the user is eligible to join & hasn't joined
  getEligibleTeams(email, domain, cb) {
    let query =
      "SELECT name, id FROM teams WHERE email_domain like ?\
      AND id not in (SELECT team_id FROM users WHERE email = ?)";
    db.all(query, [domain, email], (err, rows) => {
      if (err) return cb(err, null);
      let numRows = rows.length;
      let count = 0;

      // Count members for each eligible team
      // For better performance, store this info in aggregate table in database
      // When might this be a good idea? If db use cases are more read-heavy vs. write-heavy
      // Example database schema: id, count
      // See README for more detail
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
