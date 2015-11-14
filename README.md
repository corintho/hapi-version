[![Build Status](https://travis-ci.org/corintho/hapi-version.svg?branch=master)](https://travis-ci.org/corintho/hapi-version) [![Coverage Status](https://coveralls.io/repos/corintho/hapi-version/badge.svg?branch=master)](https://coveralls.io/r/corintho/hapi-version?branch=master) [![Dependency Status](https://gemnasium.com/corintho/hapi-version.svg)](https://gemnasium.com/corintho/hapi-version)

[ ![Codeship Status for corintho/hapi-version](https://codeship.com/projects/42b6aef0-f2ba-0132-1e75-5ed004d44c71/status?branch=master)](https://codeship.com/projects/85263)

[![NPM](https://nodei.co/npm/hapi-version.png)](https://nodei.co/npm/hapi-version/)
### Description

[![Join the chat at https://gitter.im/corintho/hapi-version](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/corintho/hapi-version?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This package allows a simple versioning scheme to be applied with Hapi servers.

### Basic Usage
- Install package with: `npm install --save hapi-version`
- Include it as a requirement for your server
```
server.register({
  register: require('hapi-version')
}, function(err) {
  if(err) {
    throw err; //Bad things going on
  }
});
```
- Declare your routes to have version information
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
- When sending requests, include an 'Accept-Version' header with the proper version
```
curl --header "Accept-Version: 2.0.0" <host_url>/versioned
```
- If the requested version cannot be matched in the service, a `400` response (Bad Request) is returned

### Advanced usage
More details on the project wiki.

*Also, a look on the tests source code can be very enlightening*


### Running from source
- Check out the repository
- Use `npm test` to run the [Lab](https://www.npmjs.com/package/lab) test suite, including overall coverage statistics
- Use `npm run coverage` to generate the [Lab](https://www.npmjs.com/package/lab) coverage report written to `coverage.html` file
- Use `npm run watch` continuously run the tests while editing the source code. It requires [nodemon](https://www.npmjs.com/package/nodemon) to be installed globally
