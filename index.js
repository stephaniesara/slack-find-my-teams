const model = require("./model");
const _ = require("underscore");

class User {
  constructor(email) {
    this.email = email;
    this.domain = "";
    // this.joinedTeams = [];
    // this.eligibleTeams = [];
  }

  _isValidInput() {
    this.domain = "qa.com";
    return true;
  }

  _getTeams(cb) {
    model._getTeams(this.email, this.domain, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      cb(result);
    });
    // model._getJoinedTeams(this.email, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   this.joinedTeams = result;
    //   cb();
    // });
  }

  // _getEligibleTeams(cb) {
  //   let joinedTeamsArr = _.map(this.joinedTeams, team => {
  //     return { team_id: team.id };
  //   });
  //   model._getEligibleTeams(
  //     this.domain,
  //     this.email,
  //     joinedTeamsArr,
  //     (err, result) => {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  //       this.eligibleTeams = result;
  //       cb();
  //     }
  //   );
  // }

  _logOutput(joinedTeams, eligibleTeams) {
    console.log("✨ You are a member of:");
    // joinedTeams.forEach(team => {
    //   console.log(team.name + " (" + team.id + ")");
    // });
    console.log("\n✨ You are eligible to join:");
    // eligibleTeams.forEach(team => {
    //   console.log(team);
    // });
  }

  findMyTeams() {
    if (!this._isValidInput()) {
      console.log("error, input not valid");
      return;
    }
    this._getTeams(result => {
      this._logOutput(result);
    });
  }
}

const user = new User("daffy_duck@qa.com");
user.findMyTeams();
