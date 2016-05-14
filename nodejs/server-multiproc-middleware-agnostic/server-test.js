'use strict';

let chai = require('chai');
let server = require('./server');
let httpClient = require('digit-http-client');

const PORT = 7000;
const DEBUG_NS = 'test-server';

let expect = chai.expect;

describe('server requires configuration parameters to be created and', () => {
  it('reports an error if none are provided', () => {
    expect(server).to.throw(/configuration parameters object is required/i);
  });

  it('reports an error if some are missing', () => {
    try {
      server({ port: PORT, debugNamespace: DEBUG_NS });
    } catch (e) {
      expect(e).to.instanceOf(Error);
      expect(e.message).to.match(/invalid configuration/i);
      return;
    }

    throw new Error('Error should happened happened');
  });

  it('returns server instance if all the required configuration parameters are provided', () => {
    let srv = server({ port: PORT, debugNamespace: DEBUG_NS, requestListener: requestListener });

    expect(srv).to.haveOwnProperty('start');
    expect(srv).to.haveOwnProperty('stop');
  });
});

describe('server instance', () => {
  let srv;

  before(() => {
    srv = server({ port: PORT, debugNamespace: DEBUG_NS, requestListener: requestListener });
  });

  it('stop when it's stopped reports an error', () => {
    return srv.stop().then(
      () => { throw new Error('Promise should be rejected'); },
      e => {
        expect(e).to.instanceOf(Error);
        expect(e.message).to.match(/not running/i);
      }
    );
  });

  it('starts', () => {
    return srv.start();
  });

  it('starts when it's running doesn't report any error', () => {
    return srv.start();
  });

  it('response when is running', () => {
    return httpClient.request(`http://localhost:${PORT}`);
  });

  it('stops when it is running stop the server', () => {
    return srv.stop();
  });

  it('does not response when is stopped', () => {
    return httpClient.request(`http://localhost:${PORT}`).then(
      () => { throw new Error('Promise should be rejected'); },
      () => {}
    );
  });
});

function requestListener(req, res) {
  res.writeHead(200, { 'Content-type': 'application/json' });
  res.write('{'status':'ok'}');
  res.end();
}
