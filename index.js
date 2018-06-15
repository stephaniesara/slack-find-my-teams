const model = require("./model");
const _ = require("underscore");

class User {
  constructor(email) {
    this.email = email;
    this.domain = "";
  }

  _isValidInput() {
    this.domain = "qa.com";
    return true;
  }

  _getTeams() {
    model._getJoinedTeams(this.email, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);

      model._getEligibleTeams(this.email, this.domain, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        result.sort((a, b) => {
          if (a[2] > b[2]) {
            return -1;
          }
          if (a[2] < b[2]) {
            return 1;
          }
          return 0;
        });
        console.log(result);
      });
    });
  }

  findMyTeams() {
    if (!this._isValidInput()) {
      console.log("error, input not valid");
      return;
    }
    this._getTeams();
  }
}

const user = new User("daffy_duck@qa.com");
user.findMyTeams();
