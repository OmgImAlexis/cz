'use strict';

import fs from 'fs';
import path from 'path';

import {
    get as lodashGet,
    set as lodashSet
} from 'lodash';

import {
    weakToJSON
} from './utils';

let _config = new WeakMap();
let _defaults = new WeakMap();
let currentPath = null;

class Cz {
    constructor() {
        this[_config] = {};
        this[_defaults] = {};
    }

    get(prop) {
        const wholeObj = Object.assign(weakToJSON(_defaults), weakToJSON(_config));
        if (arguments.length === 0) {
            return wholeObj;
        }
        return lodashGet(wholeObj, prop.replace(':', '.'));
    }

    set(prop, value) {
        // Handles if prop is key or obj
        if (value === undefined) {
            for (const key of Object.keys(prop)) {
                lodashSet(_config, key, prop[key]);
            }
        } else {
            lodashSet(_config, prop.replace(':', '.'), value);
        }
    }

    defaults(obj) {
        _defaults = obj;
    }

    load(newPath) {
        const file = fs.readFileSync(newPath, 'utf-8');
        currentPath = newPath;
        if (file.length >= 1) {
            const data = JSON.parse(file);
            for (const prop in data) {
                if ({}.hasOwnProperty.call(data, prop)) {
                    _config[prop] = data[prop];
                }
            }
        }
    }

    save(newPath) {
        fs.writeFileSync(path.normalize(newPath || currentPath), JSON.stringify(_config, null, 4) + '\n', 'utf8');
    }

    args(save) {
        process.argv.slice(2).forEach(function(val) {
            val = val.slice(2).split('='); // Gets us ['db:host', 'localhost'] from '--db:host=localhost'
            this.set(val[0], val[1], save);
        });
    }

    joinGets(gets, joins) {
        const results = gets.map(function(get) {
            return this.get(get);
        });
        let finalResult = '';
        for (let i = 0; i < gets.length; i++) {
            finalResult += results[i];
            if (i + 1 !== gets.length) {
                finalResult += joins[i];
            }
        }
        return finalResult;
    }

    reset() {
        _config = new WeakMap();
    }
}

export default Cz;
