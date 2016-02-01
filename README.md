# cz
A simple config utility for nodejs

&nbsp;
&nbsp;


#### Example

````js
var config = require('./index.js');
var path = require('path');
config.load(path.normalize(__dirname + '/config.json')); // This loads the config file

config.store('disk'); // This sets the store to disk which means we write to the config file when using config.set()

config.set('random', 'random value', true); // This adds { random: 'random value' } to the config object

console.log('config', config.get()); // This will return the whole config object currently loaded
console.log('db:host', config.get('db:host')); // This will get { db:{ host:{} } } from the config object

// Below are two ways of getting objects, the bottom one is the prefered way as it joins the retrieved values for you
console.log('db:host+db:username+db:password+db:port', 'mongodb://' + config.get('db:username') + ':' + config.get('db:password') + '@' + config.get('db:host') + ':' + config.get('db:port'));
console.log('db:host+db:username+db:password+db:port', 'mongodb://' + config.joinGets(['db:username', 'db:password', 'db:host', 'db:port'], [':', '@', ':']));
````

