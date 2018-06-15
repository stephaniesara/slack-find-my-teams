# slack-find-my-teams

> This command-line program implements Slack's Find My Workspace feature. It allows the user to input an email address and see: 1) which teams that email already belongs to, 2) which teams that email is eligible to join based on domain.

## Motivation

Because this is a very useful feature, especially if you're experiencing a moment of forgetfulness!

## Instructions

1.  Install dependencies using npm install
2.  Run tests using npm test
3.  Experiment with sample input (see examples below)
4.  Enjoy and profit!

## Table of Contents

1.  [Usage](#Usage)
2.  [Technologies](#technologies)
3.  [Examples](#examples)
4.  [Testing](#testing)

## Usage

Although this program is not very useful on its own, it could be refactored into an API that allows other developers to use its functionality.

## Technologies

- Node https://nodejs.org/en/
- Underscore (additional functional methods) http://underscorejs.org/
- Commander (command line interaction) https://github.com/tj/commander.js/
- Email-validator https://www.npmjs.com/package/email-validator
- Jest (unit testing) https://facebook.github.io/jest/

## Examples

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

## Testing

From within the root directory:

```sh
$ npm test
```
