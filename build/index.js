'use strict';

var alexaSsml = require('alexa-ssml');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var CardType = {
  LinkAccount: 'LinkAccount',
  Simple: 'Simple',
  Standard: 'Standard'
};

var SpeechType = {
  PlainText: 'PlainText',
  SSML: 'SSML'
};

var Response = function () {
  function Response() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    classCallCheck(this, Response);

    this.state = state;
  }

  createClass(Response, [{
    key: 'ask',
    value: function ask(text, type) {
      return this.say(text, type).shouldEndSession(false);
    }
  }, {
    key: 'say',
    value: function say(text, type) {
      return new Response(Object.assign({}, this.state, {
        response: Object.assign({}, this.state.response, {
          shouldEndSession: true
        }, outputSpeech(text, type))
      }));
    }
  }, {
    key: 'reprompt',
    value: function reprompt(text, type) {
      return new Response(Object.assign({}, this.state, {
        response: Object.assign({}, this.state.response, {
          reprompt: Object.assign({}, outputSpeech(text, type))
        })
      }));
    }
  }, {
    key: 'card',
    value: function card(_ref) {
      var _ref$type = _ref.type;
      var type = _ref$type === undefined ? CardType.Simple : _ref$type;
      var rest = objectWithoutProperties(_ref, ['type']);

      return new Response(Object.assign({}, this.state, {
        response: Object.assign({}, this.state.response, {
          card: Object.assign({}, rest, type && { type: type })
        })
      }));
    }
  }, {
    key: 'attributes',
    value: function attributes(data) {
      return new Response(Object.assign({}, this.state, {
        sessionAttributes: Object.assign({}, this.state.sessionAttributes, data)
      }));
    }
  }, {
    key: 'shouldEndSession',
    value: function shouldEndSession(_shouldEndSession) {
      return new Response(Object.assign({}, this.state, {
        response: Object.assign({}, this.state.response, {
          shouldEndSession: _shouldEndSession
        })
      }));
    }
  }, {
    key: 'build',
    value: function build(attributes) {
      return Object.assign({
        version: '1.0'
      }, this.state, {
        response: Object.assign({
          shouldEndSession: true
        }, this.state.response)
      }, attributes || this.state.sessionAttributes ? { sessionAttributes: Object.assign({}, attributes, this.state.sessionAttributes) } : null);
    }
  }]);
  return Response;
}();

Response.ask = function () {
  var _ref2;

  return (_ref2 = new Response()).ask.apply(_ref2, arguments);
};

Response.say = function () {
  var _ref3;

  return (_ref3 = new Response()).say.apply(_ref3, arguments);
};

Response.card = function () {
  var _ref4;

  return (_ref4 = new Response()).card.apply(_ref4, arguments);
};

Response.reprompt = function () {
  var _ref5;

  return (_ref5 = new Response()).reprompt.apply(_ref5, arguments);
};

Response.shouldEndSession = function () {
  var _ref6;

  return (_ref6 = new Response()).shouldEndSession.apply(_ref6, arguments);
};

Response.build = function (params) {
  return Object.keys(params).reduce(function (response, action) {
    var options = params[action];
    var text = typeof options === 'string' ? options : options;
    var type = typeof options === 'string' ? undefined : options.type;
    switch (action) {
      case 'ask':
        return response.ask(text, type);
      case 'say':
        return response.say(text, type);
      case 'reprompt':
        return response.reprompt(text, type);
      case 'card':
        return response.card(options);
      case 'attributes':
        return response.attributes(options);
      case 'shouldEndSession':
        return response.shouldEndSession(options);
    }
  }, new Response());
};

var outputSpeech = function outputSpeech(text) {
  var type = arguments.length <= 1 || arguments[1] === undefined ? SpeechType.PlainText : arguments[1];

  if (type === SpeechType.SSML || (typeof text === 'undefined' ? 'undefined' : _typeof(text)) === 'object') {
    var speech = (typeof text === 'undefined' ? 'undefined' : _typeof(text)) === 'object' ? alexaSsml.render(text) : text;
    return { outputSpeech: { type: SpeechType.SSML, ssml: speech } };
  } else {
    return { outputSpeech: { type: type, text: text } };
  }
};

// For commonjs compatibility
var ask = Response.ask;
var say = Response.say;
var card = Response.card;
var reprompt = Response.reprompt;
var shouldEndSession = Response.shouldEndSession;
var build = Response.build;

exports.CardType = CardType;
exports.SpeechType = SpeechType;
exports['default'] = Response;
exports.ask = ask;
exports.say = say;
exports.card = card;
exports.reprompt = reprompt;
exports.shouldEndSession = shouldEndSession;
exports.build = build;
