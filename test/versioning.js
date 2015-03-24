var async = require('async'),
    expect = require('chai').expect,
    server = require('./utils/server'),
    serverVersioned = require('./utils/server-versioned'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script();

function buildOptions(version, url, header) {
  var opts = {
    method: 'GET',
    url: url || '/'
  };
  /*jshint -W041 */
  if(version != null) {
    opts.url = url || '/versioned';
    opts.headers = {
    };
    opts.headers[header || 'Accept-Version'] = version;
  }
  return opts;
}

function validateResponse(response, status, message) {
  expect(response.statusCode).to.equal(status);
  /*jshint -W041 */
  if(message != null) {
    expect(response.result).to.be.a(typeof(message));
    expect(response.result).to.be.equal(message);
  }
}

lab.experiment('Versioning', function(){
  lab.test('should work without header and no special configuration', function(done) {
    server.inject(buildOptions(null), function(response){
      validateResponse(response, 200, 'Hello world!');
      done();
    });
  });

  lab.test('should work without header, but with proper configuration', function(done) {
    server.inject(buildOptions(null), function(response){
      validateResponse(response, 200, 'Hello world!');
      done();
    });
  });

  lab.test('should return proper response according to version', function(done) {
    async.parallel([
      function(done) {
        server.inject(buildOptions('1.0.0'), function(response){
          validateResponse(response, 200, 'Hello world!');
          done();
        });
      },
      function(done) {
        server.inject(buildOptions('2.0.0'), function(response){
          validateResponse(response, 200, 'Hello world 2.0!');
          done();
        });
      },
      function(done) {
        server.inject(buildOptions('3.0.0'), function(response){
          validateResponse(response, 200, 'Hello world 3.0!');
          done();
        });
      }
    ], done);
  });

  lab.test('should error on invalid version', function(done) {
    server.inject(buildOptions('4.0.0'), function(response){
      var result = response.result;
      validateResponse(response, 400);
      done();
    });
  });

  lab.test('should support semver style configuration', function(done) {
    async.parallel([
      function(done) {
        server.inject(buildOptions('0.5.0', '/semver'), function(response){
          validateResponse(response, 200, 'Old!');
          done();
        });
      },
      function(done) {
        server.inject(buildOptions('1.0.0', '/semver'), function(response){
          validateResponse(response, 200, 'Old!');
          done();
        });
      },
      function(done) {
        server.inject(buildOptions('3.0.0', '/semver'), function(response){
          validateResponse(response, 200, 'New!');
          done();
        });
      },
      function(done) {
        server.inject(buildOptions('4.9.7', '/semver'), function(response){
          validateResponse(response, 200, 'New!');
          done();
        });
      },
      function(done) {
        server.inject(buildOptions('1.5.0', '/semver'), function(response){
          validateResponse(response, 400);
          done();
        });
      },
      function(done) {
        server.inject(buildOptions('2.5.0', '/semver'), function(response){
          validateResponse(response, 400);
          done();
        });
      }
    ], done);

  });

  lab.test('should respect custom header name', function(done){
    async.parallel([
      function(done) {
        serverVersioned.inject(buildOptions('2.0.0', null, 'invalid-version-header'), function(response){
          validateResponse(response, 200, 'Hello world!');
          done();
        });
      },
      function(done) {
        serverVersioned.inject(buildOptions('1.0.0', null, 'custom-name'), function(response){
          validateResponse(response, 200, 'Hello world!');
          done();
        });
      },
      function(done) {
        serverVersioned.inject(buildOptions('2.0.0', null, 'custom-name'), function(response){
          validateResponse(response, 200, 'Hello world 2.0!');
          done();
        });
      },
      function(done) {
        serverVersioned.inject(buildOptions('3.0.0', null, 'custom-name'), function(response){
          validateResponse(response, 400);
          done();
        });
      }
    ], done);
  });

  lab.test('should allow custom error response');
});
