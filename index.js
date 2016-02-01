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
    get: function(props){
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
            return finalResult.join('');
        }
    },
    set: function(prop, value, save) {
        config[prop] = value;
        if(!save && saveToDisk){
            fs.writeFileSync(currentPath, JSON.stringify(config, null, 4) + '\n', 'utf8');
        }
        if(save) {
            let file = fs.readFileSync(currentPath, 'utf-8');
            if(file.length){
                let data = JSON.parse(file);
                let tempConfig = {};
                for(let prop in data){
                    if (data.hasOwnProperty(prop)) {
                        tempConfig[prop] = data[prop];
                    }
                }
                tempConfig[prop] = value;
                fs.writeFileSync(currentPath, JSON.stringify(tempConfig, null, 4) + '\n', 'utf8');
            }
        }
        config[prop] = value;
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
    }
};
