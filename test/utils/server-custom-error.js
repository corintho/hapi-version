var hapi = require('hapi'),
    server = new hapi.Server();

server.connection({port: 3000});

server.register({
  register: require('../..'),
  options: {
    error: {
      status: 499,
      message: 'This is not the page you are looking for'
    }
  }
}, function(err) {
  if(err) {
    throw err; //Bad things going on
  }
});

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

module.exports = server;