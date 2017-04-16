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

class Cz {
    constructor() {
        this._config = new WeakMap();
        this._defaults = new WeakMap();
        this._path = null;
    }

    get(prop) {
        const wholeObj = Object.assign(weakToJSON(this._defaults), weakToJSON(this._config));
        if (arguments.length === 0) {
            return wholeObj;
        }
        return lodashGet(wholeObj, prop.replace(':', '.'));
    }

    set(prop, value) {
        // Handles if prop is key or obj
        if (value === undefined) {
            for (const key of Object.keys(prop)) {
                lodashSet(this._config, key, prop[key]);
            }
        } else {
            lodashSet(this._config, prop.replace(':', '.'), value);
        }
    }

    defaults(obj) {
        this._defaults = obj;
    }

    load(newPath) {
        try {
            const file = fs.readFileSync(newPath, 'utf-8');
            this._path = newPath;
            // We use 2 as an empty file with a new line would return 1
            if (file.length >= 2) {
                const data = JSON.parse(file);
                for (const prop of Object.keys(data)) {
                    this._config[prop] = data[prop];
                }
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
    }

    save(newPath) {
        if (arguments.length === 0 && this._path === null) {
            throw new Error('No path provided.');
        } else {
            fs.writeFileSync(path.normalize(newPath || this._path), JSON.stringify(this._config, null, 4) + '\n', 'utf8');
        }
    }

    args() {
        const args = process.argv.filter(arg => {
            return arg.startsWith('--') && arg.includes('=');
        });
        args.forEach(arg => {
            arg = arg.slice(2).split('='); // Gets us ['db:host', 'localhost'] from '--db:host=localhost'
            this.set(arg[0], arg[1]);
        });
    }

    joinGets(gets, joins) {
        // @TODO: Add support for a single join param instead of just array
        const results = gets.map(get => {
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
        this._config = new WeakMap();
    }
}

export default Cz;
