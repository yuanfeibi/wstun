(function() {
  var https, old_https_request;

  https = require("https");

  old_https_request = https.request;

  https.request = function() {
    var options;
    options = arguments[0];
    options.rejectUnauthorized = false;
    return old_https_request.apply(void 0, Array.apply(null, arguments));
  };

}).call(this);

