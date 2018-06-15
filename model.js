const db = require("./db");

class userModel {
  _getTeams(email, domain, cb) {
    let query =
      "SELECT teams.name, teams.id FROM users INNER JOIN teams\
      WHERE users.email = ? and teams.id = users.team_id";
    db.all(query, [email], (err, rows) => {
      console.log(rows);
      if (err) {
        cb(err, null);
      }
      query =
        "SELECT name, id FROM teams WHERE email_domain like ?\
      AND id not in (SELECT team_id FROM users WHERE email = ?)";

      let total = 0;

      db.each(query, [domain, email], (err, result) => {
        console.log(result);
        // cb(err, result);
        query = "SELECT count(*) FROM users where team_id = ?";
        db.get(query, [result.id], (err, newResult) => {
          // total += result["count(*)"];
          // console.log(result);
          // console.log(total);
          console.log(result.name, newResult["count(*)"]);
        });
      });
      // query =
      //   "select id from teams where email_domain like 'qa.com' and id not in (select team_id from users where email = 'daffy_duck@qa.com)";
      // db.each(query, [], (err, result) => {
      //   console.log(result);
      // });
    });
  }

  // _getJoinedTeams(email, cb) {
  //   let query =
  //     "SELECT teams.name, teams.id FROM users INNER JOIN teams \
  //     WHERE users.email = ? and teams.id = users.team_id";
  //   db.all(query, [email], (err, rows) => {
  //     console.log(rows);
  //     cb(err, rows);
  //   });
  // }

  // _getEligibleTeams(domain, email, joinedTeamsArr, cb) {
  //   console.log(joinedTeamsArr);
  //   let query =
  //     "SELECT count(id) from teams WHERE email_domain like ? AND id not in (?)";
  //   db.all(query, [domain, joinedTeamsArr.toString()], (err, rows) => {
  //     console.log(rows);
  //     cb(err, rows);
  //   });
  // const query =
  //   'select count(id) from teams where email_domain like "qa.com" and id not in (select team_id from users where email = "daffy_duck@qa.com")';
  // const query = 'select team_id from users where email = "daffy_duck@qa.com"';
  // db.all(query, [], (err, rows) => {
  //   console.log(rows);
  //   cb(err, rows);
  // });
  // }
}

// select id from teams where email_domain like 'qa.com' and id not in (select team_id from users where email = 'daffy_duck@qa.com');

module.exports = new userModel();
