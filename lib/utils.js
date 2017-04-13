"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var weakToJSON = function weakToJSON(obj) {
    return JSON.parse(JSON.stringify(obj));
};

exports.weakToJSON = weakToJSON;