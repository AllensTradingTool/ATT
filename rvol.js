const getAPIkey = require('./getAlphavantageKey.js');
const alpha = require('alphavantage')({key : `${getAPIkey()}`});
const fs = require('fs');
const chalk = require('chalk');


const symbol = 'PEI'


const currentRVOL = async () => {
	const arr = [],
		arr2 = [];

	//Function to reduce arrays
	const reducer = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);

	await alpha.data.daily(symbol).then((data) => {
		let x = 0;
		for(let key in data['Time Series (Daily)']){
			x++
			if(x <= 5){
				let volume = data['Time Series (Daily)'][key]['5. volume'];
				arr.push(volume)
				if(x == 5){
					arr2.push(Math.round(((parseInt(arr[0])/((arr.reduce(reducer)-parseInt(arr[0]))/5))*10))/10)
					x = 0;
				}
			}
		}
	})
	return arr2;
}

(async () => {
	let rvol = await currentRVOL();

	console.log(rvol)
})();