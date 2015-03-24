var boom = require('boom'),
    semver = require('semver');

module.exports.register = function(server, options, next) {
  var defaults = {

  };

  server.ext('onPreHandler', function(request, reply) {
    var versions = request.route.settings.plugins.versions,
        selectedOption = null,
        version = request.headers['accept-version'];
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
      reply(boom.preconditionFailed());
    }
  });

  return next();

};

module.exports.register.attributes = {
  pkg: require('./package.json')
};
