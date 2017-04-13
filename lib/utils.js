'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var flattenObject = function flattenObject(ob) {
    var toReturn = {};
    var flatObject = void 0;
    for (var i in ob) {
        if (!{}.hasOwnProperty.call(ob, i)) {
            continue;
        }
        // Exclude arrays from the final result
        // Check this http://stackoverflow.com/questions/4775722/check-if-object-is-array
        if (ob[i] && Array === ob[i].constructor) {
            continue;
        }
        if (_typeof(ob[i]) === 'object') {
            flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!{}.hasOwnProperty.call(flatObject, x)) {
                    continue;
                }
                // Exclude arrays from the final result
                if (flatObject[x] && Array === flatObject.constructor) {
                    continue;
                }
                toReturn[i + (isNaN(x) ? ':' + x : '')] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
};

var weakToJSON = function weakToJSON(obj) {
    return JSON.parse(JSON.stringify(obj));
};

exports.flattenObject = flattenObject;
exports.weakToJSON = weakToJSON;