# cz
[![Coverage Status](https://coveralls.io/repos/github/OmgImAlexis/cz/badge.svg?branch=master)](https://coveralls.io/github/OmgImAlexis/cz?branch=master)
A simple config utility for nodejs

&nbsp;
&nbsp;


#### Example

````js
const path = require('path');
const config = require('cz');

// Loads the config file into cz
config.load('./config.json');

// Sets Cz to { random: 'random value' }
config.set('random', 'random value');

// This will return the whole config object currently loaded
console.log('config', config.get());

// This will get { db:{ host:{} } } from the config object
console.log('db:host', config.get('db:host'));

// Here's a typical example of how this is used
console.log('mongodb://' + config.get('db:username') + ':' + config.get('db:password') + '@' + config.get('db:host') + ':' + config.get('db:port') + '/' + config.get('db:collection'));

// Cz provides a little helper to join gets for you
console.log('mongodb://' + config.joinGets(['db:username', 'db:password', 'db:host', 'db:port', 'db:collection'], [':', '@', ':', '/']));
````

### Hierarchical configuration

Cz sets `defaults()` as the most bottom object and applies all changes to the config object on top of that meaning anywhere in your app you can use `config.defaults({})` to override the default values.

```js
const config = require('cz');

config.defaults({
    port: 4000,
    logging: false
});

config.set('port', 5000);
config.get('port'); // 5000

config.reset();
config.get('port'); // 4000
```

To reset defaults just use `config.defaults({});`
To reset the config itself we provide `config.reset();`
