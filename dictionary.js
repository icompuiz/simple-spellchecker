'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const MD5 = require('./md5');

/**
 * Represents a simple dictionary that uses a bloom filter to tell you if a word exists in a preloaded list
 */

class Dictionary {

    constructor(wordlist) {
        this.wordlist = wordlist;
    }

    get bitmap() {
        return this._bitmap;
    }

    /**
     * Read in the wordlist file
     * Initialize the empty bitmap with 0xfffff spaces
     * Then compute the hashCodes for each word and insert the word into it's space in the bitmap
     */

    load(wordlist) {

        wordlist = wordlist || this.wordlist;

        return fs
            .readFileAsync(wordlist)
            .then((wordlistAsBuffer) => {
                let wordlistAsStringArray = wordlistAsBuffer.toString().split('\n');
                this._bitmap = _.fill(new Array(0xfffff), 0);
                return wordlistAsStringArray;
            })
            .each((wordAsString) => {
                let wordHashCode = wordAsString.hashCode(5);
                let index = parseInt(wordHashCode, 16);
                this.bitmap[index] = 1;
            });
    }

    /**
     * Checks the bitmap for the word using it's hashCode. 
     * If the value at the index is truthy. Return true, false otherwise
     */

    has(wordAsString) {

        let wordHashCode = wordAsString.hashCode(5);
        let index = parseInt(wordHashCode, 16);

        let exists = this.bitmap[index];

        return !!exists;

    }

}

module.exports = Dictionary;

/**
 * Extend the string prototype to include this hashCode utility
 * Computes the MD5 hash using a thirdparty library (see md5.js)
 * extract a 12 bytes (6 long substring) abd returns the value
 */

String.prototype.hashCode = function() {

    let md5HashCode = MD5.md5(this);

    md5HashCode = md5HashCode.substring(6, 11)

    return md5HashCode;
};
