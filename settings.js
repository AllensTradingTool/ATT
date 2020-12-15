const fs = require('fs');


const getSettings = () => {
	let a = fs.readFileSync('./settings.txt');
	let length = 90;
	if(a.toString().split(',')[0].split(':')[1] == '1Month'){
		length = 20;
	}
	if(a.toString().split(',')[0].split(':')[1] == '3Month'){
		length = 60;
	}
	if(a.toString().split(',')[0].split(':')[1] == '6Month'){
		length = 120;
	}
	if(a.toString().split(',')[0].split(':')[1] == '1Year'){
		length = 253;
	}

	let retData = {
		length : length,
		mode : a.toString().split(',')[1].split(':')[1]
	}
	return retData;
}

module.exports = getSettings;