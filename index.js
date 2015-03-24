var boom = require('boom'),
    semver = require('semver');

module.exports.register = function(server, options, next) {
  var defaults = {
    header: options.header || 'accept-version',
    error: {
      status: 400,
      message: null
    }
  };
  
  if(options.error) {
    defaults.error.status = options.error.status || defaults.error.status;
    defaults.error.message = options.error.message || defaults.error.message;
  }
  
  defaults.header = defaults.header.toLowerCase();

  server.ext('onPreHandler', function(request, reply) {
    var versions = request.route.settings.plugins.versions,
        selectedOption = null,
        version = request.headers[defaults.header];
    if(!version || !versions) {
      return reply.continue();
    }
    selectedOption = versions[version];
    if(!selectedOption) {
      //No exact match, look for a semver match
      for(var key in versions) {
        if(semver.validRange(key)) {
          if(semver.satisfies(version, key)) {
            selectedOption = versions[key];
            break;
          }
        }
      }
    }
    //Match, with 'true', just pass through to default handler
    if (selectedOption === true) {
      reply.continue();
    //Match, with a function, call the function
    } else if (typeof selectedOption === 'function') {
      selectedOption(request, reply);
    //No match
    } else {
      return reply(boom.create(defaults.error.status, defaults.error.message));
    }
  });

  return next();

};

module.exports.register.attributes = {
  pkg: require('./package.json')
};
