# cz

A simple config utility for Nodejs

## Table of contents

- [Quick start](#quick-start)
- [Status](#status)
<!-- - [What's included](#whats-included)
- [Bugs and feature requests](#bugs-and-feature-requests) -->
- [Documentation](#documentation)
<!-- - [Contributing](#contributing)
- [Community](#community)
- [Versioning](#versioning)
- [Creators](#creators)
- [Copyright and license](#copyright-and-license) -->

## Quick start

````js
const Cz = require('cz');
const config = new Cz();

// Loads the config file into Cz
config.load('./config.json');

// Sets Cz's default value for "port" to 4000
// If the value is unset using config.set('port', null) then Cz will fall back to 4000
config.defaults({
    port: 4000
});

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

## Status

[![Coverage Status](https://coveralls.io/repos/github/OmgImAlexis/cz/badge.svg?branch=master)](https://coveralls.io/github/OmgImAlexis/cz?branch=master)
[![Build Status](https://travis-ci.org/OmgImAlexis/cz.svg?branch=master)](https://travis-ci.org/OmgImAlexis/cz)
[![GitHub issues](https://img.shields.io/github/issues/omgimalexis/cz.svg)](https://github.com/omgimalexis/cz/issues)
[![npm](https://img.shields.io/npm/v/cz.svg)](https://www.npmjs.com/package/cz)

## Documentation

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
