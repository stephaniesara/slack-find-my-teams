# slack-find-my-teams

> This command-line program implements Slack's Find My Workspace feature. Based on a single email address input, it outputs:
>
> 1.  which teams that email already belongs to (name, id),
> 2.  which teams that email is eligible to join based on email domain (name, id, member count).

## Motivation

Because this is helpful user-facing feature, especially in occasional moments of forgetfulness!

## Instructions

1.  Install dependencies using `npm install`
2.  Run tests using `npm test`
3.  Experiment with sample input (see examples below)
4.  Enjoy and profit!

## Table of Contents

1.  [Technologies](#technologies)
2.  [Development](#development)
3.  [Examples](#examples)
4.  [Testing](#testing)
5.  [Limitations](#limitations)

## Technologies

- Node: https://nodejs.org/en/
- Underscore (additional functional methods): http://underscorejs.org/
- Commander (command line interaction): https://github.com/tj/commander.js/
- Email-validator: https://www.npmjs.com/package/email-validator
- Jest (unit testing): https://facebook.github.io/jest/

## Development

From the root directory:

```sh
$ npm install
```

## Examples

Check out daffy_duck's workspaces!

```sh
$ node index.js daffy_duck@qa.com
```

     ✨ You are a member of:
      qa-efla9j2t9jiyjkghnp (8476817264)
      qa-707b996f6c27793e23 (8476809328)

      ✨ You are eligible to join:
      qa-a31ec0d8929183e19d (8476929792) 2 members
      qa-a4d8c5b04c0eb04185 (8476888864) 2 members
      ...
      ... (27 teams total)
      ...
      qa-e6e79ada5579646db6 (8462390449) 0 members

For additional help:

```sh
$ node index.js -h
```

### Invalid input

In cases of invalid input, an error will be printed.

Example:

```sh
$ node index.js fakeEmail
```

## Testing

From within the root directory:

```sh
$ npm test
```

## Limitations

As the app is currently designed, it is not built for scale. For example, if a user is eligible for **many many** teams, performance could become slow. The reason is because for every eligible team, the program makes one additional database query. That could add up to a lot of queries! One workaround is to pre-compute the member counts for each team (perhaps on a regularly scheduled worker) and store that information as an aggregate table in persistent database storage. Though, this is of course not without tradeoffs (extra storage, non-real-time count accuracy).

It might be designed as so:

    sqlite> .schema teams_counts
    CREATE TABLE teams_counts(
    id INTEGER NOT NULL PRIMARY KEY
    ,members VARCHAR(18) NOT NULL
    );

For more information please see the model.js file.
