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
            for(let prop of data){
                config[prop] = data[prop];
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
    get: function(prop){
        if(prop){
            return config[prop];
        } else {
            return config;
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
                for(let prop of data){
                    tempConfig[prop] = data[prop];
                }
                tempConfig[prop] = value;
                fs.writeFileSync(currentPath, JSON.stringify(tempConfig, null, 4) + '\n', 'utf8');
            }
        }
        config[prop] = value;
    }
};
