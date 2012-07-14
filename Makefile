full-make: npm-install all-tests

npm-install:
	npm install

all-tests: static-analysis unit-test

static-analysis:
		./node_modules/.bin/jslint ./{lib,bin}/*.js

unit-test:
		./node_modules/.bin/mocha 
