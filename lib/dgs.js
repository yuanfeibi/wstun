module.exports = function (rServer) {
    var getPort = require('get-port');
    var express = require('express');
    var app = express();

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.get('/token', function (req, res) {
        res.json(rServer.token);
    });

    app.get('/trays', function (req, res) {
        res.json(rServer.trayList.map(function (item) {
            return {
                id: item.id,
                name: item.name
            };
        }));
    });

    app.post('/availableport', function (req, res, next) {
        getPort().then(function (port) {
            var ret = {port: port, token: rServer.token};
            if (req.body.trayId) {
                // find client by id
                var client = rServer.trayList.find(function (item) {
                    return item.id == req.body.trayId;trayId
                });
                if (client) {
                    ret.trayPort = client.portTcp;
                }
            }
            res.json(ret);
        }, next);
    });

    app.delete('/ws/:port(\\d+)', function (req, res) {
        var port = req.params['port'];
        rServer.closeWSConnectionBy(port);
        res.json(`Web socket tunnel related to port ${port} is closed successfully.`);
    });

    app.all('/', function (req, res) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("<!DOCTYPE 'html'>");
        res.write("<html>");
        res.write("<head>");
        res.write("<title>WSTUN</title>");
        res.write("</head>");
        res.write("<body>");
        res.write("iotronic-wstun is running!");
        res.write("</body>");
        res.write("</html>");
        res.end();
    });

    return app;
};