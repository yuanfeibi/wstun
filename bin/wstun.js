#!/usr/bin/env node

//###############################################################################
//##
//# Copyright (C) 2014-2015 Andrea Rocco Lotronto, 2017 Nicola Peditto
//##
//# Licensed under the Apache License, Version 2.0 (the "License");
//# you may not use this file except in compliance with the License.
//# You may obtain a copy of the License at
//##
//# http://www.apache.org/licenses/LICENSE-2.0
//##
//# Unless required by applicable law or agreed to in writing, software
//# distributed under the License is distributed on an "AS IS" BASIS,
//# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//# See the License for the specific language governing permissions and
//# limitations under the License.
//##
//###############################################################################


var portTunnel , argv, client, host, localport, optimist, port, server, wsHost, wst, _, _ref, _ref1;

var _ = require("under_score");

optimist = require('optimist').usage("\n" +
    "Run websocket tunnel and reverse tunnel such server or client.\n" +
    "To run websocket tunnel server: wstun.js -s 8080\nTo run websocket tunnel client: wstun.js -t localport:host:port ws://wshost:wsport\n" +
    "Now connecting to localhost:localport is same as connecting to host:port on wshost\n" +
    "If websocket server is behind ssl proxy, then use \"wss://host:port\" in client mode\n" +
    "For security, you can \"lock\" the tunnel destination on server side, for eample:\n" +
    "wstunnel -s 8080 -t host:port\n" +
    "Server will tunnel incomming websocket connection to host:port only, so client can just run\n" +
    "wstunnel -t localport ws://wshost:port\n" +
    "If client run:\n" +
    "wstunnel -t localpost:otherhost:otherport ws://wshost:port\n" +
    "* otherhost:otherport is ignored, tunnel destination is still \"host:port\" as specified on server.\n"
).string("s").describe('s', 'run as server, specify listen port')
    .string("t").alias('t', "tunnel").describe('tunnel', 'run as tunnel client, specify localport:host:port')
    .string("ssl").describe('ssl', '\"true\" | \"false\" to enable|disable HTTPS communication.')
    .string("key").describe('key', '[only with --ssl=true] path to private key certificate.')
    .string("cert").describe('cert', '[only with --ssl=true] path to public key certificate.');

argv = optimist.argv;

wst = require("../lib/wrapper");

if (argv.s && !argv.r) {
  
    // WS tunnel server side
    if (argv.t) {
        _ref = argv.t.split(":"), host = _ref[0], port = _ref[1];
        server_opts = {dstHost:dstHost, dstPort:dstPort, ssl:https_flag, key:key, cert:cert};
    }
    else {
        server_opts = {ssl:argv.ssl, key:argv.key, cert:argv.cert};
    }

    server = new wst.server(server_opts);
    server.start(argv.s);

}else if (argv.t) {

  // WS tunnel client side

  client = new wst.client;

  wsHost = _.last(argv._);
  _ref1 = argv.t.split(":"), localport = _ref1[0], host = _ref1[1], port = _ref1[2];

  if (host && port) {
    client.start(localport, wsHost, "" + host + ":" + port);
  } else {
    client.start(localport, wsHost);
  }


}else if (argv.r) {

  // WS reverse tunnel

  if (argv.s){

    // Server side
    server_opts = {ssl:argv.ssl, key:argv.key, cert:argv.cert};
    server = new wst.server_reverse(server_opts);
    server.start(argv.s);

  }
  else{

    // Client side
    client = new wst.client_reverse;
    wsHost = _.last(argv._);
    _ref1 = argv.r.split(":"), portTunnel = _ref1[0], host = _ref1[1], port =_ref1[2];
    client.start(portTunnel, wsHost, "" + host + ":" + port);

  }

} else {

  // Wrong options
  return console.log(optimist.help());

}