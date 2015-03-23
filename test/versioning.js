var expect = require('chai').expect,
    server = require('./utils/server');

function buildOptions(version, url) {
  var opts = {
    method: 'GET',
    url: '/'
  };
  /*jshint -W041 */
  if(version != null) {
    opts.url = '/versioned';
    opts.headers = {
      'Accept-Version': version
    };
  }
  if(url != null) {
    opts.url = url;
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

describe('Versioning', function(){
  it('should work without header and no special configuration', function() {
    server.inject(buildOptions(null), function(response){
      validateResponse(response, 200, 'Hello world!');
    });
  });
  
  it('should work without header, but with proper configuration', function() {
    server.inject(buildOptions(null), function(response){
      validateResponse(response, 200, 'Hello world!');
    });
  });
  
  it('should return proper response according to version', function() {
    server.inject(buildOptions('1.0.0'), function(response){
      validateResponse(response, 200, 'Hello world!');
    });
    server.inject(buildOptions('2.0.0'), function(response){
      validateResponse(response, 200, 'Hello world 2.0!');
    });
    server.inject(buildOptions('3.0.0'), function(response){
      validateResponse(response, 200, 'Hello world 3.0!');
    });
  });
  
  it('should error on invalid version', function() {
    server.inject(buildOptions('4.0.0'), function(response){
      var result = response.result;
      validateResponse(response, 412);
    });
  });
  
  it('should support semver style configuration', function() {
    server.inject(buildOptions('0.5.0', '/semver'), function(response){
      validateResponse(response, 200, 'Old!');
    });
    server.inject(buildOptions('1.0.0', '/semver'), function(response){
      validateResponse(response, 200, 'Old!');
    });
    server.inject(buildOptions('3.0.0', '/semver'), function(response){
      validateResponse(response, 200, 'New!');
    });
    server.inject(buildOptions('4.9.7', '/semver'), function(response){
      validateResponse(response, 200, 'New!');
    });
    server.inject(buildOptions('1.5.0', '/semver'), function(response){
      validateResponse(response, 412);
    });
    server.inject(buildOptions('2.5.0', '/semver'), function(response){
      validateResponse(response, 412);
    });
  });
  
  it('should allow custom header name');
  
  it('should allow custom error response');
});
