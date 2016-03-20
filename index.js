'use strict';
const fs = require('fs');
const path = require('path');
let saveToDisk = false;
let currentPath = path.normalize(__dirname + '/config.json');
let config = {};

module.exports = {
    load: function(path) {
        let file = fs.readFileSync(path, 'utf-8');
        if(file.length){
            let data = JSON.parse(file);
            for(let prop in data){
                if (data.hasOwnProperty(prop)) {
                    config[prop] = data[prop];
                }
            }
        }
    },
    store: function(store) {
        if(store === 'memory'){
            saveToDisk = false;
        }
        if(store === 'disk' || store === 'file'){
            saveToDisk = true;
        }
        return saveToDisk;
    },
    get: function(props, returnObject){
        if(!arguments.length){
            return config;
        } else {
            let finalResult = [];
            props = props.indexOf('+') ? props.split('+') : props;
            for(let topProp of props){
                let v = config;
                let x = topProp.split(':');
                for(let i = 0; i < x.length; i++) {
                    if(!v){ return null; }
                    v = v[x[i]];
                }
                finalResult.push(v);
            }
            if(returnObject){
                return finalResult;
            } else {
                return finalResult.join('');
            }
        }
    },
    set: function(prop, value, save) {
        let schema = config; // a moving reference to internal objects within obj
        let pList = prop.split(':');
        let len = pList.length;
        for(let i = 0; i < len-1; i++) {
            let elem = pList[i];
            if(!schema[elem]){
                schema[elem] = {};
            }
            schema = schema[elem];
        }
        schema[pList[len-1]] = value;

        if(!save && saveToDisk){
            fs.writeFileSync(currentPath, JSON.stringify(config, null, 4) + '\n', 'utf8');
        }
        if(save) {
            let file = fs.readFileSync(currentPath, 'utf-8');
            if(file.length){
                let data = JSON.parse(file);
                let tempConfig = {};
                for(let prop in data){ // jshint ignore:line
                    if (data.hasOwnProperty(prop)) {
                        tempConfig[prop] = data[prop];
                    }
                }
                let schema = tempConfig; // a moving reference to internal objects within obj
                let pList = prop.split(':');
                let len = pList.length;
                for(let i = 0; i < len-1; i++) {
                    let elem = pList[i];
                    if(!schema[elem]){
                        schema[elem] = {};
                    }
                    schema = schema[elem];
                }
                schema[pList[len-1]] = value;
                fs.writeFileSync(currentPath, JSON.stringify(tempConfig, null, 4) + '\n', 'utf8');
            }
        }
    },
    joinGets: function(gets, joins){
        let finalResult = '';
        let results = gets.map(function(get){
            return module.exports.get(get);
        });
        for(let i = 0; i < gets.length; i++){
            finalResult+= results[i];
            if(i+1 !== gets.length){
                finalResult+= joins[i];
            }
        }
        return finalResult;
    },
    args: function(save){
        process.argv.slice(2).forEach(function(val) {
            val = val.slice(2).split('='); // Gets us ['db:host', 'localhost'] from '--db:host=localhost'
            module.exports.set(val[0], val[1], save);
        });
    },
    env: function(){
        // @TODO
    },
    defaults: function(obj, save){
        for (let a in obj) {
            if(obj.hasOwnProperty(a)){
                config[a] = obj[a];
            }
        }
        if(save){
            module.exports.save();
        }
    },
    save: function(){
        fs.writeFileSync(currentPath, JSON.stringify(config, null, 4) + '\n', 'utf8');
    }
};
