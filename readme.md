# WSTUN - Modified for Data Gateway Server and Data Gateway Client

## Overview
See [readme](readme-wstun.md) of `@mdslab/wstun`

## Installation
1. Download source code and go to the root directory.
2. Run `npm install` to install all dependencies.
3. Run `npm link` to expose `wstun` cmd globally.

## DGS Usage
```javascript
// start server
wstun -r -s 8080
```

### Get token
```text
GET http://localhost:8080/token

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 38
ETag: W/"26-OnijoHwIHbgqooKaIW/fxvGiQAA"
Date: Wed, 08 Jul 2020 04:23:28 GMT
Connection: keep-alive

"95d9b8e6-39fb-46cd-a401-7d7f9119f710"
```

### Get list of registered trays
```text
GET http://localhost:8080/trays

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 2
ETag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
Date: Wed, 08 Jul 2020 04:34:35 GMT
Connection: keep-alive

[{"id": "test","name": "test"}]
```

### request available port
```text
POST http://localhost:8080/availableport

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-fs6jVncwj5ob5fovjIPuxuKIycQ"
Date: Wed, 08 Jul 2020 04:39:39 GMT
Connection: keep-alive

{
  "port": 57255,
  "token": "95d9b8e6-39fb-46cd-a401-7d7f9119f710"
}
```

### Request available port and return port of tray ws tunnel
```text
POST http://localhost:8080/availableport

{"trayId":"test"}

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-aZoi+f6MfcSHUwlYvJl2coUBQnY"
Date: Wed, 08 Jul 2020 04:37:06 GMT
Connection: keep-alive

{
  "port": 57245,
  "token": "95d9b8e6-39fb-46cd-a401-7d7f9119f710",
  "trayPort": "3306"
}
```

### Close ws tunnel by port
```text
DELETE http://localhost:8080/ws/3306

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 64
ETag: W/"40-IjZVx+QRCNTrAi8IdDEvyRt4MR0"
Date: Wed, 08 Jul 2020 04:41:21 GMT
Connection: keep-alive

"Web socket tunnel related to port 3306 is closed successfully."
```

## DGC Usage
```javascript
// create a ws tunnel to server with token
wstun -r3306:10.197.34.164:3306 ws://localhost:8080 --token=95d9b8e6-39fb-46cd-a401-7d7f9119f710

// client(tray service) creates a ws tunnel and register itself
wstun -r3306:10.197.34.164:3306 ws://localhost:8080 --token=95d9b8e6-39fb-46cd-a401-7d7f9119f710 --trayid=test --trayname=test
```
