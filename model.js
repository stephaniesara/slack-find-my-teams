const db = require("./db");

class userModel {
  _getJoinedTeams(email, cb) {
    let query =
      "SELECT teams.name, teams.id FROM users INNER JOIN teams\
      WHERE users.email = ? and teams.id = users.team_id";
    db.all(query, [email], (err, rows) => {
      cb(err, rows);
    });
  }

  _getEligibleTeams(email, domain, cb) {
    let query =
      "SELECT name, id FROM teams WHERE email_domain like ?\
      AND id not in (SELECT team_id FROM users WHERE email = ?)";

    let teams = [];
    // // let numTeams =

    db.all(query, [domain, email], (err, result) => {
      // console.log(result);
      // cb(err, result);
      if (err) {
        cb(err);
      }
      let numTeams = result.length;
      console.log(numTeams);
      // console.log(result);

      result.forEach(team => {
        query = "SELECT count(*) from users where team_id = ?";
        db.get(query, [team.id], (err, newResult) => {
          // console.log(team.id, newResult);
          let obj = {
            name: team.name,
            id: team.id,
            count: newResult["count(*)"]
          };
          teams.push(obj);
          if (teams.length === numTeams) {
            cb(null, teams);
          }
        });
      });

      // query = "SELECT count(*) FROM users where team_id = ?";
      // db.get(query, [result.id], (err, newResult) => {
      //   // total += result["count(*)"];
      //   // console.log(result);
      //   // console.log(total);
      //   // console.log(result.name, newResult["count(*)"]);
      //   teams.push([result.name, newResult["count(*)"]]);
      //   // console.log(teams.length);
      //   if (teams.length === numTeams) {
      //     cb(err, teams);
      //   }
      //   // console.log(teams);
      // });
      // cb(err, teams);
    });
  }

  // _getEligibleTeams(email, domain, cb) {
  //   let query =
  //     "SELECT name, id FROM teams WHERE email_domain like ?\
  //     AND id not in (SELECT team_id FROM users WHERE email = ?)";

  //   let teams = [];
  //   // let numTeams =

  //   db.each(query, [domain, email], (err, result) => {
  //     // console.log(result);
  //     // cb(err, result);
  //     query = "SELECT count(*) FROM users where team_id = ?";
  //     db.get(query, [result.id], (err, newResult) => {
  //       // total += result["count(*)"];
  //       // console.log(result);
  //       // console.log(total);
  //       // console.log(result.name, newResult["count(*)"]);
  //       teams.push([result.name, newResult["count(*)"]]);
  //       // console.log(teams.length);
  //       if (teams.length === numTeams) {
  //         cb(err, teams);
  //       }
  //       // console.log(teams);
  //     });
  //     // cb(err, teams);
  //   });
  // }

  // query =
  //   "select id from teams where email_domain like 'qa.com' and id not in (select team_id from users where email = 'daffy_duck@qa.com)";
  // db.each(query, [], (err, result) => {
  //   console.log(result);
  // });

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
