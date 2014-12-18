/*
The MIT License (MIT)

Copyright (c) 2014 Andrea Rocco Lotronto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
  var WebSocketServer, bindSockets, http, net, url, wst_server;


  WebSocketServer = require('websocket').server;
  http = require('http');
  url = require("url");
  net = require("net");
  bindSockets = require("./bindSockets");

  //var httpServer,wsServerForControll,tcpServer;

var eventEmitter = require('events').EventEmitter;

var newWSTCP_DATA = new eventEmitter();

wst_server = function(dstHost, dstPort) {

  this.dstHost = dstHost;
  this.dstPort = dstPort;
  
  this.httpServer = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received unhandled request for ' + request.url);
    response.writeHead(404);
    return response.end();
  });
      
  this.wsServerForControll = new WebSocketServer({
    httpServer: this.httpServer,
    autoAcceptConnections: false
    });
  
  this.tcpServer = new net.createServer();
  //this.wsConnectionForControll;
}

wst_server.prototype.start = function(port) {

  this.httpServer.listen(port, function() {
    return console.log((new Date()) + " Server is listening on port " + port);
  });
  
  this.wsServerForControll.on('request', (function(_this){
    return function(request){
    
      var uri = url.parse(request.httpRequest.url, true);
      
      if (uri.query.dst != undefined){
        
        var remoteAddr = uri.query.dst;
        var hostComodo, portTcp;
        ref1 = remoteAddr.split(":"), hostComodo = ref1[0], portTcp = ref1[1];
        
        _this.tcpServer.listen(portTcp);

        console.log("Created TCP server on port "+portTcp);
        
        _this.wsConnectionForControll = request.accept('tunnel-protocol', request.origin);
        console.log("WS Connectio for Control Created");

      }
    //GESTIONE REQUEST PER CONNESSIONE CANALE DATI-----------------------------------
      else{ 
        console.log("Request per canale dati------------>>>>>>>>>");
        //console.log("wsTCPConnection Remote Port:::::"+_this.wsTCPConnection.socket.remotePort);//.socket.address().port);
        
        //_this.wsTCPConnection = request.accept('tunnel-protocol', request.origin);
        newWSTCP_DATA.emit('created', request.accept('tunnel-protocol', request.origin));
      }
    }
  })(this));

  this.tcpServer.on('connection', (function(_this){
    return function(tcpConn){
      tcpConn.wsConnection;
      
          //console.log("AAAAAAAAAAAA++++++++++++++++++:::"+Object.getOwnPropertyNames(_this));
          console.log("TCP Server Connection detected on remote port::"+tcpConn.remotePort);
          var idConnection = randomIntInc(1,1000);
          var msgForNewConnection = "NC:"+idConnection;
          
          _this.wsConnectionForControll.sendUTF(msgForNewConnection);
          /*
          Generare un blocco di istruzioni sincone in modo da attendere che la nuova connessione WS 
          sia eseguite e salvarla su una variabile locare alla connessione TCP

          */

          newWSTCP_DATA.once('created',(function(_this){
            return function(wsTCP){
               console.log(typeof(_this.wsConnection));
              tcpConn.wsConnection = wsTCP;
              console.log("BBBBBBBBBBBB-------------:::"+Object.getOwnPropertyNames(_this));
              //console.log("BBBBBBBBBBBB+++++++++++++:::"+Object.getOwnPropertyNames(_this2));
              console.log("EVENTO!!!!!!!!!!!");
              console.log("WS Server Connection detected on remote port::"+tcpConn.wsConnection.socket.remotePort);
           
              //bindSockets(tcpConn.wsConnection,tcpConn);
            }
          })(this));
          
          
          tcpConn.on('data', (function(_this){
            return function(buffer){
                  //console.log(typeof(_this.wsConnection));
                  //console.log("CCCCCCCCCC++++++++++++++++++:::"+Object.getOwnPropertyNames(_this));
                  console.log("WS Data remote port::"+tcpConn.wsConnection.socket.remotePort);//+_this.wsConnComodo.socket.remotePort);
                  console.log("Data on TCP remote port::"+tcpConn.remotePort);
                  tcpConn.wsConnection.sendBytes(buffer);
                  console.log("Send TCP buffer on WS remote port::"+tcpConn.wsConnection.socket.remotePort);

                  tcpConn.wsConnection.once('message', function(message){
                    console.log("WS message recevide from remote port::"+tcpConn.wsConnection.socket.remotePort);
                    tcpConn.write(message.binaryData);
                    console.log("WS message on TCP remote port::"+tcpConn.remotePort);
                  });
            }
          })(this));
          
    }
  })(this));

};

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = wst_server;