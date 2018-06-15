const Promise = require("bluebird");
const db = require("./db");

class UserModel {
  _getJoinedTeams(email) {
    return new Promise((res, rej) => {
      let query =
        "SELECT teams.name, teams.id FROM users INNER JOIN teams\
      WHERE users.email = ? and teams.id = users.team_id";
      db.all(query, [email], (err, rows) => {
        if (err) {
          rej(err);
        }
        res(rows);
      });
    });
  }

  _getEligibleTeams(email, domain) {
    return new Promise((res, rej) => {
      let query =
        "SELECT name, id FROM teams WHERE email_domain like ?\
      AND id not in (SELECT team_id FROM users WHERE email = ?)";

      db.all(query, [domain, email], (err, result) => {
        if (err) {
          rej(err);
        }
        let numTeams = result.length;
        let teams = [];
        let count = 0;

        result.forEach(team => {
          query = "SELECT count(*) from users where team_id = ?";
          db.get(query, [team.id], (err, newResult) => {
            if (err) {
              return cb(err, null);
            }
            let obj = {
              name: team.name,
              id: team.id,
              count: newResult["count(*)"]
            };
            teams.push(obj);
            count++;
            if (count === numTeams) {
              res(teams);
            }
          });
        });
      });
    });
  }
}

module.exports = new UserModel();
