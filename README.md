[![Build Status](https://travis-ci.org/corintho/hapi-version.svg?branch=master)](https://travis-ci.org/corintho/hapi-version)
[![Coverage Status](https://coveralls.io/repos/corintho/hapi-version/badge.svg?branch=master)](https://coveralls.io/r/corintho/hapi-version?branch=master)
[![Dependency Status](https://gemnasium.com/corintho/hapi-version.svg)](https://gemnasium.com/corintho/hapi-version)

[![NPM](https://nodei.co/npm/hapi-version.png)](https://nodei.co/npm/hapi-version/)
### Description

This package allows a simple versioning scheme to be applied with Hapi servers.

### Usage
1. Install package with: `npm install --save hapi-version`
1. Include it as a requirement for your server
```
server.register({
  register: require('hapi-version')
}, function(err) {
  if(err) {
    throw err; //Bad things going on
  }
});
```
1. Declare your routes to have version information
```
server.route({
  method: 'GET',
  path: '/versioned',
  handler: function(req, res) {
    res('Hello world!');
  },
  config: {
    plugins: {
      versions: {
        '1.0.0': true,
        '2.0.0': function(req, res) {
          res('Hello world 2.0!');
        }
      }
    }
  }
});
```
1. When sending requests, include an 'Accept-Version' header with the proper version
```
curl --header "Accept-Version: 2.0.0" <host_url>/versioned
```


### Matching with semver
**TODO**

*For now, take a look at the tests*


### Running from source
- Check out the repository
- Run `npm test` to run the [mocha](https://www.npmjs.com/package/mocha) test suite once
- Run `npm run coverage` to generate the [istanbul](https://www.npmjs.com/package/istanbul) coverage report
- Run `npm run watch` to run [mocha](https://www.npmjs.com/package/mocha) continually listening to changes in source code and running tests automatically