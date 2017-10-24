# Tunnels and Reverse Tunnels on WebSocket for Node.js


## Overview

A set of tools to establish TCP tunnels (or TCP reverse tunnels) over Websocket connections for circumventing the problem of directly connect to hosts behind a strict firewall or without public IP. It also supports WebSocket Secure (wss) connections.

## Installation
npm install reverse-wstunnel

## Usage in NodeJS

### Server example
```JavaScript
var wstun = require("reverse-wstunnel");

// HTTP
server = new wstun.server();

// or HTTPS
server = new wstun.server({ssl:true, key:"<PATH-PRIVATE-KEY>.pem", cert:"<PATH-PUBLIC-KEY>.pem"});

//the port of the websocket server
server.start(<PORT>)
```
### Client example
```JavaScript
var wstun = require("reverse-wstunnel");

client = new wstun.client();

// HTTP
wsHost = 'ws://wsServer:wsPort';

// HTTPS
wsHost = 'wss://wsServer:wsPort';

// 'localPort' is the opened port of the localhost for the tunnel
// 'remoteHost:remotePortport' is the service that will be tunneled
client.start(localPort, wsHost, 'remoteHost:remotePort');
```

### Reverse Server example
```JavaScript
var wstun = require("reverse-wstunnel");

// HTTP
reverse_server = new wstun.server_reverse();

// or HTTPS
reverse_server = new wstun.server_reverse({ssl:true, key:"<PATH-PRIVATE-KEY>.pem", cert:"<PATH-PUBLIC-KEY>.pem"});

//the port of the websocket server
reverse_server.start(<PORT>);

``` 
### Reverse Client example
```JavaScript   
var wstun = require("reverse-wstunnel");

reverse_client = new wstun.client_reverse();

// HTTP
wsHost = 'ws://wsServer:wsPort';

// HTTPS
wsHost = 'wss://wsServer:wsPort';

// 'portTunnel' is the port that will be opened on the websocket server
// 'remoteHost:remotePort' is the service that will be reverse tunneled
reverse_client.start(portTunnel, wsHost, 'remoteHost:remotePort');
```



## Usage from command-line
Using the *wstun.js* executable located in *bin* directory:

For running a websocket tunnel server:  

    //over HTTP
    ./wstun.js -s 8080

    //over HTTPS
    ./wstun.js -s 8080 --ssl=true --key="<PATH-PRIVATE-KEY>.pem" --cert="<PATH-PUBLIC-KEY>.pem"

For running a websocket tunnel client: 

    ./wstun.js -t 33:2.2.2.2:33 ws://host:8080 (or wss://host:8080 for HTTPS)

In the above example, client picks the final tunnel destination, similar to ssh tunnel.  Alternatively for security reason, you can lock tunnel destination on the server end, example:

**Server:**
        
        ./wstun.js -s 8080 -t 2.2.2.2:33

**Client:**
        
        ./wstun.js -t 33 ws://server:8080 (or wss://server:8080 for HTTPS)

In both examples, connection to localhost:33 on client will be tunneled to 2.2.2.2:33 on server via websocket connection in between.


**Reverse tunnels**

For running a websocket reverse tunnel server:

    // over HTTP
    ./wstun.js -r -s 8080

    // over HTTPS
    ./wstun.js -r -s 8080 --ssl=true --key="<PATH-PRIVATE-KEY>.pem" --cert="<PATH-PUBLIC-KEY>.pem"

For running a websocket reverse tunnel client:

    ./wstun.js -r 6666:2.2.2.2:33 ws://server:8080 (or wss://server:8080 for HTTPS)

In the above example the client tells the server to open a TCP server on port 6666 and all connection on this port are tunneled to the client that is directely connected to 2.2.2.2:33
