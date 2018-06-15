const program = require("commander");
const { validate } = require("email-validator");
const { getJoinedTeams, getEligibleTeams } = require("./model");

class User {
  constructor(email) {
    this.email = email;
    this.domain = "";
  }

  _isValidInput() {
    if (!validate(this.email)) {
      return false;
    }
    const indexOfAt = this.email.indexOf("@");
    this.domain = this.email.substring(indexOfAt + 1);
    return true;
  }

  _getTeams(cb) {
    getJoinedTeams(this.email, (err, joined) => {
      if (err) return console.log(err);
      if (joined.length === 0) {
        return console.log(
          "That email does not exist in our system, please try again!"
        );
      }
      getEligibleTeams(this.email, this.domain, (err, eligible) => {
        if (err) return console.log(err);
        cb(joined, eligible);
      });
    });
  }

  _logTeams(header, teams, hasCount) {
    console.log("\n" + header);
    teams.forEach(team => {
      let line = `${team.name} (${team.id})`;
      if (hasCount) {
        line += `\t ${team.count} members`;
      }
      console.log(line);
    });
  }

  _logOutput(joined, eligible) {
    this._logTeams("✨ You are a member of:", joined, false);
    this._logTeams("✨ You are eligible to join:", eligible, true);
  }

  findMyTeams() {
    if (!this._isValidInput()) {
      return console.log("That is not a valid email, please try again!");
    }
    this._getTeams((joined, eligible) => {
      this._logOutput(joined, eligible);
    });
  }
}

// Program starts here ->
program.option("<email>").action(email => {
  const user = new User(email);
  user.findMyTeams();
});
program.parse(process.argv);

// For testing methods in spec.js
module.exports = User;
