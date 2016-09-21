[![Build Status](https://travis-ci.org/jahglow/r-table-columns.svg?branch=master)](https://travis-ci.org/jahglow/r-table-columns) [![codecov](https://codecov.io/gh/jahglow/r-table-columns/branch/master/graph/badge.svg)](https://codecov.io/gh/jahglow/r-table-columns)

# `r-table-columns`

`TableColumns` builds an array of columns that contains column information in the ro indexed by `defaultHeaderRow` which is passed in method configuration. 
A `defaultHeaderRow` is to be considered as a target row for actions to take place, like sorting or filtering: clicking on those column headers in the row would perform the action.

### Commands (configured in package.json)

- `npm install` installs all dependencies of the project
- `npm run build:prd` generates minified build files under `/dist` folder 
- `npm run build:dev` generates build files under `/dist` folder and starts watching all changes made to the project during this session, appending them to the build files
- `npm test` Runs tests that have been written and put into `/src/__tests__` folder. (Note: test should follow name convention: `NameOfClass-test.js` which is a test for `NameOfFile.js`)
- `npm run lint` Lints your JavaScript code placed in src folder.
- `npm run docs` generates documentation for your project `.js` files that use JSDoc3 comments and puls them into `docs` folder
- `npm run docs-commit`  publishes documentation to `http://ConfirmitASA.github.io/[RepoName]/[version]/` where `[RepoName]` is name of your repository as well as name specified in `package.json -> name` AND `[version]` is the version in your `package.json`. 
Please make sure you have the `npm run docs-commit` command configured properly with the correct name of repo to be used there.
