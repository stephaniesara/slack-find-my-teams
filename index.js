const program = require("commander");
const { validate } = require("email-validator");
const { getJoinedTeams, getEligibleTeams } = require("./model");

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

  // Makes asynchronous calls to helper model methods
  _getTeams(cb) {
    getJoinedTeams(this.email, (err, joined) => {
      if (err) return console.log(err);
      // if email is not in database, return immmediately
      if (joined.length === 0) {
        return console.log(
          "Email does not exist in our system, please try again!"
        );
      }
      this.joined = joined;
      getEligibleTeams(this.email, this.domain, (err, eligible) => {
        if (err) return console.log(err);
        this.eligible = eligible;
        cb();
      });
    });
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
    this._getTeams(() => {
      this._logOutput();
    });
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
