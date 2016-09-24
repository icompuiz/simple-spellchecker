'use strict';

const assert = require('assert');
const path = require('path');
const Dictionary = require('../dictionary.js');
const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

WordInWordListShouldExist();
WordNotInWordListShouldNotExist();

function WordInWordListShouldExist() {

    // load the wordlist
    // initialize the dictionary
    // invoke dict.exists(word)
    // assert exists === true

    var wordlist = path.resolve(__dirname, '../wordlist.txt');

    return fs
        .readFileAsync(wordlist)
        .then((wordlistAsBuffer) => {
            let wordlistAsStringArray = wordlistAsBuffer.toString().split('\n');
            let dict = new Dictionary(wordlist);
            return dict
                .load()
                .then(() => {
                    wordlistAsStringArray.forEach((word) => {
                        assert.ok(dict.has(word));
                    });
                });
        })


}


function WordNotInWordListShouldNotExist() {

    // load the dummy wordlist
    // initialize the dictionary
    // invoke dict.exists(word)
    // assert exists === true

    var wordlist = path.resolve(__dirname, '../wordlist.txt');
    let falsePositive = 0;

    let wordlistAsStringArray = _.map(new Array(200), () => {
    	return randomString(6);
    });

    let dict = new Dictionary(wordlist);
    return dict
        .load()
        .then(() => {
            wordlistAsStringArray.forEach((word) => {

            	if (dict.has(word)) {
            		falsePositive++;
            	}
            });
            console.log('%d false positives idenitified (%d%)', falsePositive, falsePositive * 100 / wordlistAsStringArray.length);
        });


}

function randomString(len) {
    len = len || 5;
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
