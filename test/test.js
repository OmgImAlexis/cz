'use strict';

import path from 'path';

import {
    expect
} from 'chai';

import Cz from '../lib/index';

const config = new Cz();

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

describe('save config to file', () => {
    before(() => {
        config.reset();
        config.set('test', 'value');
        config.save(path.join(__dirname, './config.json'));
    });

    it(`test should be value`, () => expect(config.get('test')).to.equal('value'));
    it(`config.json should contain {"test": "value"}`, () => {
        const configJson = require('./config.json');
        expect(configJson.test).to.equal('value');
    });
});

describe('load config from file', () => {
    before(() => {
        config.reset();
        config.load(path.join(__dirname, './config.json'));
    });

    it(`config.get() should return {test: 'value'}`, () => expect(JSON.stringify(config.get())).to.equal(JSON.stringify({test: 'value'})));
});