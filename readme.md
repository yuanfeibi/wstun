# Tunnels and Reverse Tunnels on WebSocket for Node.js


## Overview

A set of Node.js tools to establish TCP tunnels (or TCP reverse tunnels) over Websocket connections for circumventing the problem of directly connect to hosts behind a strict firewall or without public IP. It also supports WebSocket Secure (wss) connections.

## Installation
```
npm install @mdslab/wstun
```

## Usage (from a Node.js application)

### Instantiation of a tunnel server 
```JavaScript
var wstun = require("@mdslab/wstun");

// without security
server = new wstun.server();

// or with security (<PRIVATE-KEY-PATH> and <PUBLIC-KEY-PATH> are the paths of the private and public keys in .pem formats)
server = new wstun.server({ssl:true, key:"<PRIVATE-KEY-PATH>", cert:"<PUBLIC-KEY-PATH>"});

//start the server (<PORT> is the listening port)
server.start(<PORT>)
```

### Implementation of a tunnel client
```JavaScript
var wstun = require("@mdslab/wstun");

client = new wstun.client();

// without security
wstunHost = 'ws://wstunServerIP:wstunPort';

// or with security 
wstunHost = 'wss://wstunServerIP:wstunPort';

// <localPort> is the port on the localhost on which the tunneled service will be reachable
// <remoteHost>:<remotePort> is the endpoint of the service to be tunneled
client.start(<localPort>, wstunHost, '<remoteHost>:<remotePort>');
```

### Instantiation of a reverse tunnel server
```JavaScript
var wstun = require("@mdslab/wstun");

// without security
reverse_server = new wstun.server_reverse();

// or with security (<PRIVATE-KEY-PATH> and <PUBLIC-KEY-PATH> are the paths of the private and public keys in .pem formats)
reverse_server = new wstun.server_reverse({ssl:true, key:"<PRIVATE-KEY-PATH>", cert:"<PUBLIC-KEY-PATH>"});

//start the server (<PORT> is the listening port)
reverse_server.start(<PORT>);

``` 
### Implementation of a reverse tunnel client
```JavaScript   
var wstun = require("reverse-wstunnel");

reverse_client = new wstun.client_reverse();

// without security
wstunHost = 'ws://wstunServerIP:wstunPort;

// or with security 
wstunHost = 'wss:/wstunServerIP:wstunPort';

// <publicPort> is the port on the reverse tunnel server on which the tunneled service will be reachable
// <remoteHost>:<remotePort> is the endpoint of the service to be reverse tunneled
reverse_client.start(<publicPort>, wstunHost, '<remoteHost>:<remotePort>');
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
