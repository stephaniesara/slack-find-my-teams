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

  _getTeams(cb) {
    _getJoinedTeams(this.email, (err, joinedTeams) => {
      if (err) {
        console.log(err);
        return;
      }
      this.joinedTeams = joinedTeams;
      // console.log(joinedTeams);

      _getEligibleTeams(this.email, this.domain, (err, eligibleTeams) => {
        if (err) {
          console.log(err);
          return;
        }
        this.eligibleTeams = sortBy(eligibleTeams, "count").reverse();
        // console.log(eligibleTeams);
        cb();
      });
    });
  }

  _logOutput() {
    console.log(this.joinedTeams);
    console.log(this.eligibleTeams);
  }

  findMyTeams() {
    if (!this._isValidInput()) {
      console.log("error, not valid input");
      return;
    }
    this._getTeams(() => {
      this._logOutput();
    });
  }
}

const user = new User("daffy_duck@qa.com");
user.findMyTeams();
