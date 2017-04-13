'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cz = function () {
    function Cz() {
        _classCallCheck(this, Cz);

        this._config = new WeakMap();
        this._defaults = new WeakMap();
        this._path = null;
    }

    _createClass(Cz, [{
        key: 'get',
        value: function get(prop) {
            var wholeObj = Object.assign((0, _utils.weakToJSON)(this._defaults), (0, _utils.weakToJSON)(this._config));
            if (arguments.length === 0) {
                return wholeObj;
            }
            return (0, _lodash.get)(wholeObj, prop.replace(':', '.'));
        }
    }, {
        key: 'set',
        value: function set(prop, value) {
            // Handles if prop is key or obj
            if (value === undefined) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.keys(prop)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var key = _step.value;

                        (0, _lodash.set)(this._config, key, prop[key]);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                (0, _lodash.set)(this._config, prop.replace(':', '.'), value);
            }
        }
    }, {
        key: 'defaults',
        value: function defaults(obj) {
            this._defaults = obj;
        }
    }, {
        key: 'load',
        value: function load(newPath) {
            var file = _fs2.default.readFileSync(newPath, 'utf-8');
            this._path = newPath;
            if (file.length >= 1) {
                var data = JSON.parse(file);
                for (var prop in data) {
                    if ({}.hasOwnProperty.call(data, prop)) {
                        this._config[prop] = data[prop];
                    }
                }
            }
        }
    }, {
        key: 'save',
        value: function save(newPath) {
            _fs2.default.writeFileSync(_path2.default.normalize(newPath || this._path), JSON.stringify(this._config, null, 4) + '\n', 'utf8');
        }
    }, {
        key: 'args',
        value: function args(save) {
            process.argv.slice(2).forEach(function (val) {
                val = val.slice(2).split('='); // Gets us ['db:host', 'localhost'] from '--db:host=localhost'
                this.set(val[0], val[1], save);
            });
        }
    }, {
        key: 'joinGets',
        value: function joinGets(gets, joins) {
            var results = gets.map(function (get) {
                return this.get(get);
            });
            var finalResult = '';
            for (var i = 0; i < gets.length; i++) {
                finalResult += results[i];
                if (i + 1 !== gets.length) {
                    finalResult += joins[i];
                }
            }
            return finalResult;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this._config = new WeakMap();
        }
    }]);

    return Cz;
}();

exports.default = Cz;