const User = require("../index");

describe("Identifies invalid input email", () => {
  test("non-email addresses", () => {
    testUser = new User("thisisaninvalidemail");
    expect(testUser._isValidInput()).toEqual(false);
    testUser = new User("&234");
    expect(testUser._isValidInput()).toEqual(false);
    testUser = new User("");
    expect(testUser._isValidInput()).toEqual(false);
  });
});

describe("Works for valid input email", () => {
  test("result data has correct shape", done => {
    const callback = () => {
      expect(testUser.joined[0]).toHaveProperty("id");
      expect(testUser.eligible[0]).toHaveProperty("id");
      expect(testUser.eligible[0]).toHaveProperty("count");
      done();
    };
    testUser = new User("QqkyXxw48XKNaIzk@example.com");
    testUser.domain = "example.com";
    testUser._getTeams(callback);
  });

  test("correctly count joined and eligible teams", done => {
    const callback = () => {
      expect(testUser.joined.length).toEqual(2);
      expect(testUser.eligible.length).toEqual(27);
      done();
    };
    testUser = new User("daffy_duck@qa.com");
    testUser.domain = "qa.com";
    testUser._getTeams(callback);
  });

  test("correctly count members on eligible teams", done => {
    const callback = () => {
      expect(testUser.eligible[0].count).toEqual(6);
      done();
    };
    testUser = new User("donkey_kong@forest.com");
    testUser.domain = "forest.com";
    testUser._getTeams(callback);
  });

  test("eligible teams are in desc order", done => {
    const callback = () => {
      expect(testUser.eligible[0].count).toBeGreaterThanOrEqual(
        testUser.eligible[testUser.eligible.length - 1].count
      );
      done();
    };
    testUser = new User("alice+8476817264-91180@qa.com");
    testUser.domain = "qa.com";
    testUser._getTeams(callback);
  });
});
