const program = require("commander");
const { validate } = require("email-validator");
const { getJoinedTeams, getEligibleTeams } = require("./model");
const Promise = require('bluebird');

class User {
  constructor(email) {
    this.email = email;
    this.domain = "";
    this.joined = []; // teams the user already joined
    this.eligible = []; // teams the user could join
  }

  // If input is email address, returns true and assigns domain to user
  _isValidInput() {
    if (!validate(this.email)) {
      return false;
    }
    const indexOfAt = this.email.indexOf("@"); // index of @ symbol
    this.domain = this.email.substring(indexOfAt + 1);
    return true;
  }
  
//   rows = [thing1, thing2,...] // array with data to query on
//   return Promise.map(rows, asyncFunction); // where function returns a Promise (in this case, promisified query function returns a promise)

//   let promises = [];
//   rows.forEach(row, () => {
//     promises.push(asyncFunction(row));
//   });
//   return Promise.all(promises);


  // // implement Promise.all
  // Promise.all = promises => {
  //   return new Promise((res, rej) => {
  //     let count = 0;
  //     let returnedPromises = [];
  //     promises.forEach((promise, i) => {
  //       promise.then(result => {
  //         returnedPromises[i] = result;
  //         if (++count === promises.length) {
  //           res(returnedPromises);
  //         }
  //       })
  //       .catch(err => {
  //         rej(err);
  //       });
  //     });
  //   });
  // }
  
// Promise.map = (array, promiseReturningFunction) => {
//   return new Promise((res, rej) => {
//     let promises = [];
//     let count = 0;
//     array.forEach((entry, i) => {
//       promiseReturningFunction(entry).then(result => {
//         // this is what's different from Promise.all
//         // instead of simply chaining promise.then, you call the promiseFunc and then chain .then
//         promises[i] = result;
//         if (++count === array.length) {
//           res(promises);
//         }
//       });;
//     });
    
//   });
// };


  // Makes asynchronous calls to helper model methods
  _getTeams(cb) {
    const joinedPromise = getJoinedTeams(this.email)
      .then(joined => {
        if (joined.length === 0) {
          console.log("Email does not exist in our system, please try again!");
          return;
        }
        this.joined = joined;
      })
      .catch(err => {
        return err;
      });
    const eligiblePromise = getEligibleTeams(this.email, this.domain)
      .then(eligible => {
        this.eligible = eligible;
      })
      .catch(err => {
        return err;
      });
    return Promise.all([joinedPromise, eligiblePromise]);
  }

  // Helper function to print values from list of teams
  _logTeams(header, teams, hasCount) {
    console.log("\n" + header);
    teams.forEach(team => {
      let line = `${team.name} (${team.id})`;
      // add member count for eligible teams only
      if (hasCount) {
        line +=
          team.count === 1
            ? `\t ${team.count} member`
            : `\t ${team.count} members`;
      }
      console.log(line);
    });
  }

  // Main print function
  _logOutput() {
    this._logTeams("✨ You are a member of:", this.joined, false);
    this._logTeams("✨ You are eligible to join:", this.eligible, true);
  }

  // Main application function
  findMyTeams() {
    if (!this._isValidInput()) {
      return console.log("Not a valid email, please try again!");
    }
    // this._getTeams(() => {
    //   this._logOutput();
    // });
    
    this._getTeams()
      .then(() => this._logOutput());
  }
}

// Start here ->
program.option("<email>").action(email => {
  const user = new User(email);
  user.findMyTeams();
});
program.parse(process.argv);

// For testing in spec.js
module.exports = User;
