const Promise = require("bluebird");
const { _getJoinedTeams, _getEligibleTeams } = require("./model");
const { sortBy } = require("underscore");

class User {
  constructor(email) {
    this.email = email;
    this.domain = "";
  }

  _isValidInput() {
    // TODO
    this.domain = "qa.com";
    return true;
  }

  _getTeams() {
    return new Promise((res, rej) => {
      _getJoinedTeams(this.email)
        .then(joinedTeams => {
          this.joinedTeams = joinedTeams;
        })
        .then(() => {
          _getEligibleTeams(this.email, this.domain).then(eligibleTeams => {
            this.eligibleTeams = sortBy(eligibleTeams, "count").reverse();
            res("test");
          });
        })
        .catch(err => rej(err));
    });
  }

  _logOutput(str) {
    console.log(str);
    console.log(this.joinedTeams);
    console.log(this.eligibleTeams);
  }

  findMyTeams() {
    if (!this._isValidInput()) {
      console.log("error, not valid input");
      return;
    }
    this._getTeams()
      .then(str => this._logOutput(str))
      .catch(err => console.log(err));
  }
}

const user = new User("daffy_duck@qa.com");
user.findMyTeams();
