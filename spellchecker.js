'use strict';
const argv = require('yargs').argv;
const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const readline = require('readline');
const Dictionary = require('./dictionary.js');

class SpellChecker {

	constructor(wordlist) {

		this.dictionary = new Dictionary(wordlist);
		this.dictionaryLoaded = false;

		this.dictionary.load()
			.then(() => {

				this.dictionaryLoaded = true;
			});

	}

	load() {

		return new Promise((resolve) => {

			let interval = setInterval(() => {
				if (this.dictionaryLoaded) {
					console.log('Dictionary loaded...');
					clearInterval(interval);
					return resolve();
				}
			})
		});

	}

	check(search) {
        return this.dictionary.has(search);
	}

	static run() {

	    let wordlist = argv.wordlist || 'wordlist.txt';
		let spck = new SpellChecker(wordlist);

	    const rl = Promise.promisifyAll(readline.createInterface({
	        input: process.stdin,
	        output: process.stdout
	    }));

	    spck.load()
	        .then(() => {

	            promptForSearch();

	            function promptForSearch(dictionary) {

	                rl.question('Enter a word [CTRL+C to exit]: ', (search) => {

	                    if (spck.check(search)) {
	                    	console.log(`${search} is spelled correctly`);
	                    } else {
	                    	console.log(`${search} is misspelled`);
	                    }

	                    return promptForSearch();

	                });

	            }

	        });


	}

}

module.exports = SpellChecker;

if (require.main === module) {
	SpellChecker.run();
}