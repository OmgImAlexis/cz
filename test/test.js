'use strict';

import fs from 'fs';
import path from 'path';

import {
    expect
} from 'chai';

import Cz from '../src/index';

const config = new Cz();
const configTwo = new Cz();
const emptyConfig = new Cz();
const anotherEmptyConfig = new Cz();
const theLastConfig = new Cz();

describe('set config using string param and string value', () => {
    before(() => {
        config.set('redis:host', 'localhost');
        config.set('redis:port', 6379);
    });

    it(`redis:host should be localhost`, () => expect(config.get('redis:host')).to.equal('localhost'));
    it(`redis:port should be 6379`, () => expect(config.get('redis:port')).to.equal(6379));
});

describe('set config using string param and object value', () => {
    before(() => {
        config.set('redis', {
            host: 'fakehost.tld',
            port: 3000
        });
    });

    it(`redis:host should be fakehost.tld`, () => expect(config.get('redis:host')).to.equal('fakehost.tld'));
    it(`redis:port should be 3000`, () => expect(config.get('redis:port')).to.equal(3000));
});

describe('set config using object param and no value', () => {
    before(() => {
        config.set({
            mongodb: {
                host: 'localhost',
                port: '27017'
            }
        });
    });

    it(`mongodb:host should be localhost`, () => expect(config.get('mongodb:host')).to.equal('localhost'));
    it(`mongodb:port should be 27017`, () => expect(config.get('mongodb:port')).to.equal('27017'));
});

describe('set config using args', () => {
    before(() => {
        config.args();
    });

    it(`arg:test should be args_test_value`, () => expect(config.get('arg:test')).to.equal('arg_test_value'));
});

describe('reset shouldn\'t effect defaults', () => {
    before(() => {
        config.reset();
        config.defaults({
            test: 'value',
            port: 4000
        });
        config.set('test', 'another value');
        config.reset();
    });

    it(`test should be value`, () => expect(config.get('test')).to.equal('value'));

    after(() => {
        config.defaults({});
    });
});

describe('save config to specified file', () => {
    before(() => {
        config.reset();
        config.set('test', 'value');
        config.save(path.join(__dirname, './config.json'));
    });

    it(`test should be value`, () => expect(config.get('test')).to.equal('value'));
    it(`config.json should contain {"test": "value"}`, () => {
        fs.readFile(path.join(__dirname, './config.json'), 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            expect(JSON.parse(data).test).to.equal('value');
        });
    });
});

describe('save config to already loaded file', () => {
    before(() => {
        const configPath = path.join(__dirname, './anotherEmptyConfig.json');
        anotherEmptyConfig.load(configPath);
        anotherEmptyConfig.set('test', 'value');
        anotherEmptyConfig.save();
    });

    it(`test should be value`, () => expect(anotherEmptyConfig.get('test')).to.equal('value'));
    it(`anotherEmptyConfig.json should contain {"test": "value"}`, () => {
        fs.readFile(path.join(__dirname, './anotherEmptyConfig.json'), 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            expect(JSON.parse(data).test).to.equal('value');
        });
    });
});

describe('save config without providing path', () => {
    before(() => {
        theLastConfig.set('test', 'value');
    });

    it(`theLastConfig.save() should throw an error since it has no path`, () => {
        expect(() => theLastConfig.save()).to.throw('No path provided.');
    });
});

describe('load config from specified file', () => {
    before(() => {
        config.reset();
        config.load(path.join(__dirname, './config.json'));
    });

    it(`config.get() should return {test: 'value'}`, () => expect(JSON.stringify(config.get())).to.equal(JSON.stringify({test: 'value'})));
});

describe('attempt to load empty config file', () => {
    before(() => {
        emptyConfig.load(path.join(__dirname, './emptyConfig.json'));
    });

    it(`config.get() should return {}`, () => expect(JSON.stringify(emptyConfig.get())).to.equal(JSON.stringify({})));
});

describe('new Cz() should create a seperate config store', () => {
    before(() => {
        config.reset();
        config.defaults({
            test: 'value'
        });
        configTwo.set('anotherTest', 'value');
    });

    it(`config.get() should be different to newConfig.get()`, () => expect(JSON.stringify(config.get())).to.not.equal(JSON.stringify(configTwo.get())));
});

describe('joinGets should join multiple get params', () => {
    before(() => {
        config.reset();
        config.defaults({});
        config.set({
            db: {
                host: 'localhost',
                port: 3000
            }
        });
    });

    it(`config.joinGets(['db:host', 'db:port'], [':']) should return localhost:3000`, () => {
        expect(config.joinGets(['db:host', 'db:port'], [':'])).to.equal('localhost:3000');
    });
});
