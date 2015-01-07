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

var WebSocketClient = require('websocket').client;
var net = require("net");
var url = require("url");
var bindSockets = require("./bindSockets_reverse");
//var remoteHost, remotePort;

wst_client_reverse = function() {

  this.wsClientForControll = new WebSocketClient();
  //this.wsClientData = new WebSocketClient();

}

wst_client_reverse.prototype.start = function(portTunnel, wsHostUrl, remoteAddr) {
  //-------------Ricavo parametri-----------------------------------------
  var urlWsHostObj = url.parse(wsHostUrl);
  var _ref1 = remoteAddr.split(":"), remoteHost = _ref1[0], remotePort = _ref1[1];
  url = "" + wsHostUrl + "/?dst=" + urlWsHostObj.hostname+":"+portTunnel;
  
  //--------Connessione al WS Server indicato--------------------
  this.wsClientForControll.connect(url, 'tunnel-protocol');
  

  this.wsClientForControll.on('connect', (function(_this){
    return function(wsConnectionForControll) {
      //console.log('wsClientForControll for  Controll connected');

      wsConnectionForControll.on('message', function(message) {
        //DEVO GESTIRE SOLO UTF8 PER CONTROLLO
        //if (message.type === 'utf8'){
          console.log("Message for new TCP Connectio on WS Server");
          var parsing = message.utf8Data.split(":");
          //console.log("Debug message splitted in 0::"+parsing[0]+" || 1::"+parsing[1]);

          //Gestione nuove connessioni su canale controllo
          if (parsing[0] === 'NC'){

            //Identifico l'id della connessionene
            var idConnection = parsing[1];

            
            this.wsClientData = new WebSocketClient();
            this.wsClientData.connect(wsHostUrl+"/?id="+idConnection, 'tunnel-protocol');

            console.log("Call WS-Server for connect id::"+parsing[1]);

            //gestione nuovi ws client distinte per ogni connessione
            this.wsClientData.on('connect', (function(_this){
              return function(wsConnectionForData){
                
                console.log("Connected wsClientData to WS-Server for id "+parsing[1]+" on localport::"+wsConnectionForData.socket.localPort);
                console.log("Start PIPE wsConnectionForData TCP client to :"+remoteHost+":"+remotePort);
                
                tcpConnection(wsConnectionForData,remoteHost,remotePort);
               
              }
            })(this));
          }
      });
    }
  })(this));
  
  //----------Gestione fallimento connessione-----------
  this.wsClientForControll.on('connectFailed', function(error) {
    console.log('WS connect error: ' + error.toString());
  });

};

function tcpConnection(wsConn,host,port){
  var tcpConn = net.connect({port: port,host: host},function(){
    });

  tcpConn.on("connect",function(){
    console.log((new Date()) + "CONNECTED TCP");
    bindSockets(wsConn,tcpConn);
  });
}

module.exports = wst_client_reverse;
