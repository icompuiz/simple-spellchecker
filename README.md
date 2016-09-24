# simple-spellchecker
A simple spell checker that uses a bloom filter to tell you if a word exists in a preloaded list. Based on CodeKata Kata05: Bloom Filters (http://codekata.com/kata/kata05-bloom-filters/)

# Pre-requisites

- NodeJS 6.x

# Before You Start

- run `npm install` to install dependencies

# Usage


- Execute
	```
	> node spellchecker.js
	```
- Then follow the prompt

# Tests

- Execute 

	```
	> node test\dictionary.spec.js
	```

This will execute two tests

1. Test that all words in the source wordlist file exist in the bitmap
1. Test that words not in the wordlist don't exist in the bitmap
	- Due to the nature of the algorithm. This test may return false positives. The test reports the number of false positives.
