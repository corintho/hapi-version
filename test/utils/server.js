var hapi = require('hapi'),
    server = new hapi.Server();

server.connection({port: 3000});

server.register({
  register: require('../..')
}, function(err) {
  if(err) {
    throw err; //Bad things going on
  }
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(req, res) {
    res('Hello world!');
  }
});

function version3(req, res) {
  res('Hello world 3.0!');
}

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
        },
        '3.0.0': version3
      }
    }
  }
});

server.route({
  method: 'GET',
  path: '/semver',
  handler: function(req, res) {
    res('Old!');
  },
  config: {
    plugins: {
      versions: {
        '<=1.0.0': true,
        '>=3.0.0': function(req, res) {
          res('New!');
        }
      }
    }
  }
});

module.exports = server;