// Generated by CoffeeScript 1.8.0
var Slack, request,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

request = require("request");

Slack = (function() {
  function Slack(token, domain) {
    this.token = token;
    this.domain = domain;
    this.api = __bind(this.api, this);
    this.webhook = __bind(this.webhook, this);
    this.detectEmoji = __bind(this.detectEmoji, this);
    this.composeUrl = __bind(this.composeUrl, this);
    this.apiMode = !this.domain ? true : false;
    this.url = this.composeUrl();
  }

  Slack.prototype.composeUrl = function() {
    if (this.apiMode) {
      return "https://slack.com/api/";
    } else {
      return "https://" + this.domain + ".slack.com/services/hooks/incoming-webhook?token=" + this.token;
    }
  };

  Slack.prototype.detectEmoji = function(emoji) {
    var obj;
    obj = [];
    if (!emoji) {
      obj["key"] = "icon_emoji";
      obj["val"] = "";
      return obj;
    }
    if (emoji.match(/^http/)) {
      obj["key"] = "icon_url";
      obj["val"] = emoji;
    } else {
      obj["key"] = "icon_emoji";
      obj["val"] = emoji;
    }
    return obj;
  };

  Slack.prototype.webhook = function(options, callback) {
    var bufferJson, emoji;
    emoji = this.detectEmoji(options.icon_emoji);
    bufferJson = {
      channel: options.channel,
      text: options.text,
      username: options.username,
      attachments: options.attachments
    };
    bufferJson[emoji["key"]] = emoji["val"];
    return request.post({
      url: this.url,
      body: JSON.stringify(bufferJson)
    }, function(err, body, response) {
      return callback(err, {
        status: err || response !== "ok" ? "fail" : "ok",
        statusCode: body.statusCode,
        headers: body.headers,
        response: response
      });
    });
  };

  Slack.prototype.api = function(method, options, callback) {
    var url;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    options = options || {};
    options.token = this.token;
    url = this.url + method;
    request({
      url: this.url + method,
      method: "GET",
      qs: options
    }, function(err, body, response) {
      if (err) {
        return callback(err, {
          status: "fail",
          response: response
        });
      }
      if (callback) {
        callback(err, JSON.parse(response));
      }
    });
    return this;
  };

  return Slack;

})();

module.exports = Slack;
