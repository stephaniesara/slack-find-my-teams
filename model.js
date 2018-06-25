const db = require("./db");
const { sortBy } = require("underscore");
const Promise = require('bluebird');

db.allAsync = Promise.promisify(db.all);
// db.query = Promise.promisify(db.all);
// Produces a function that returns a promise
// function query(queryArgs) {
//   return new Promise(res, rej) {
//     db.all(queryArgs, (err, data) => {
//       if (err) rej(err);
//       res(data);
//     }
//   }
// }

class UserModel {
  // Get a list of teams the user has already joined
  getJoinedTeams(email, cb) {
    const query =
      "SELECT teams.name, teams.id FROM teams INNER JOIN users\
      WHERE users.email = ? and teams.id = users.team_id";
    return new Promise((res, rej) => {
      db.all(query, [email], (err, rows) => {
        if (err) rej(err);
        res(rows);
      });
    });
  }

  // Get a list of teams the user is eligible to join & hasn't joined and how many people are in each of those teams already
  getEligibleTeams(email, domain, cb) {
    let query =
      "SELECT name, id FROM teams WHERE email_domain like ?\
      AND id not in (SELECT team_id FROM users WHERE email = ?)";
    return db.allAsync(query, [domain, email])
      .then(rows => {
        // let numRows = rows.length;
        // let count = 0;

        // Count members for each eligible team
        // For better performance, store this info in aggregate table in database
        // When might this be a good idea? If db use cases are more read-heavy vs. write-heavy
        // Example database schema: id, count
        // See README for more detail
//         rows = [
//           row1,
//           row2,
//           row3,
//           ...
//         ];
//         returnArray = Promise.map(rows,        
      
        return Promise.map(rows, row => {
          query = "SELECT count(*) from users where team_id = ?";
          return db.allAsync(query, [row.id])
            .then(result => {
              row.count = result["count(*)"];
              return row;
            })
            .catch(err => {
              return Promise.reject(err);
            });
          })
          .then(rows => {
            rows = sortBy(rows, "count").reverse();
            return rows;
          })
        })
      .catch(err => {
        return Promise.reject(err);
      });
    });
  }
  
//   getEligibleTeams(email, domain, cb) {
//     let query =
//       "SELECT name, id FROM teams WHERE email_domain like ?\
//       AND id not in (SELECT team_id FROM users WHERE email = ?)";
//     return new Promise((res, rej) => {
//       db.all(query, [domain, email], (err, rows) => {
//         // if (err) return cb(err, null);
//         if (err) rej(err);
//         let numRows = rows.length;
//         let count = 0;

//         // Count members for each eligible team
//         // For better performance, store this info in aggregate table in database
//         // When might this be a good idea? If db use cases are more read-heavy vs. write-heavy
//         // Example database schema: id, count
//         // See README for more detail
//         rows.forEach(row => {
//           query = "SELECT count(*) from users where team_id = ?";
//           db.get(query, [row.id], (err, result) => {
//             // if (err) return cb(err, null);
//             if (err) rej(err);
//             row.count = result["count(*)"];
//             count++;
//             if (count === numRows) {
//               // cb(null, sortBy(rows, "count").reverse());
//               res(sortBy(rows, "count").reverse());
//             }
//           });
//         });
//       });
//     });
//   }
}

module.exports = new UserModel();
