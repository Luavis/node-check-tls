
"use strict";

// Modules required here
var tls = require('tls'),
      fs = require('fs');

var options = {
        // Chain of certificate autorities
        // Client and server have these to authenticate keys 
        ca: [
              fs.readFileSync('ssl/root-cert.pem'),
              fs.readFileSync('ssl/ca1-cert.pem'),
              fs.readFileSync('ssl/ca2-cert.pem'),
              fs.readFileSync('ssl/ca3-cert.pem'),
              fs.readFileSync('ssl/ca4-cert.pem')
            ],
        // Private key of the client
        key: fs.readFileSync('ssl/agent2-key.pem'),
        // Public key of the client (certificate key)
        cert: fs.readFileSync('ssl/agent2-cert.pem'),
        NPNProtocols: ['h2', 'spdy/1', 'spdy/2', 'spdy/3', 'spdy/3.1'],
        // Automatically reject clients with invalid certificates.
        rejectUnauthorized: false             // Set false to see what happens.
    };

function checkProtocol(host, port, callback) {
    var socket = tls.connect(port, host, options, function () {

        var npn = 'http/1';
        console.log(this.npnProtocol)
        if(this.npnProtocol == 'h2')  {
            npn = 'http/2';
        }
        else if(this.npnProtocol != false) {
            if(/spdy\/[0-9\.]+/.test(this.npnProtocol)) {
                npn = this.npnProtocol;
            }
        }

        callback(npn);
    });

    socket.on('error', function(error) {
        callback(false);  // when unsupport secure connection
    })
}

tls = checkProtocol('google.com', 443, function(support) {
    console.log(support);
});
