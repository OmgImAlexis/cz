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
            try {
                var file = _fs2.default.readFileSync(newPath, 'utf-8');
                this._path = newPath;
                // We use 2 as an empty file with a new line would return 1
                if (file.length >= 2) {
                    var data = JSON.parse(file);
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = Object.keys(data)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var prop = _step2.value;

                            this._config[prop] = data[prop];
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }
        }
    }, {
        key: 'save',
        value: function save(newPath) {
            if (arguments.length === 0 && this._path === null) {
                throw new Error('No path provided.');
            } else {
                _fs2.default.writeFileSync(_path2.default.normalize(newPath || this._path), JSON.stringify(this._config, null, 4) + '\n', 'utf8');
            }
        }
    }, {
        key: 'args',
        value: function args() {
            var _this = this;

            var args = process.argv.filter(function (arg) {
                return arg.startsWith('--') && arg.includes('=');
            });
            args.forEach(function (arg) {
                arg = arg.slice(2).split('='); // Gets us ['db:host', 'localhost'] from '--db:host=localhost'
                _this.set(arg[0], arg[1]);
            });
        }
    }, {
        key: 'joinGets',
        value: function joinGets(gets, joins) {
            var _this2 = this;

            // @TODO: Add support for a single join param instead of just array
            var results = gets.map(function (get) {
                return _this2.get(get);
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