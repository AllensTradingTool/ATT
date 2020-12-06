const fs = require('fs');

const getAPIkey = () => {
	let a = fs.readFileSync('./alphavantage_key.txt');
	return a.toString().replace('key : ', '');
}

module.exports = getAPIkey;
