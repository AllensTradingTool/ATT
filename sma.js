const getAPIkey = require('./getAlphavantageKey.js');
const alpha = require('alphavantage')({key :  `${getAPIkey()}`});
const settings = require('./settings.js');


const getSMA = async (sym) => {

	let retData = {
		sma11 : [],
		sma21 : [],
		sma31 : [],
		sma41 : []
	};
	let x = 0;

	await alpha.technical.sma(sym, 'daily', 11, 'close').then(data => {
	    for(var key in data['Technical Analysis: SMA']){
	        x++
	        if(x < settings().length){
	        	//If price is below SMA is below 100
	        	if(parseFloat(data['Technical Analysis: SMA'][key].SMA) < 100){
	        		let val = data['Technical Analysis: SMA'][key].SMA;
					retData.sma11.push(val)
	        	}else{
				    // console.log(data['Technical Analysis: SMA'][key])
		            retData.sma11.push(parseFloat(data['Technical Analysis: SMA'][key].SMA))
	        	}
	        }
	    }
	})
	await alpha.technical.sma(sym, 'daily', 21, 'close').then(data => {
		x = 0;
	    for(var key in data['Technical Analysis: SMA']){
	        x++
	        if(x < settings().length){
	        	if(parseFloat(data['Technical Analysis: SMA'][key].SMA) < 100){
	        		let val = data['Technical Analysis: SMA'][key].SMA;
					retData.sma21.push(val)
	        	}else{
				    // console.log(data['Technical Analysis: SMA'][key])
		            retData.sma21.push(parseInt(data['Technical Analysis: SMA'][key].SMA))
	        	}
	        }
	    }
	})
	await alpha.technical.sma(sym, 'daily', 31, 'close').then(data => {
		x = 0;
	    for(var key in data['Technical Analysis: SMA']){
	        x++
	        if(x < settings().length){
	        	if(parseFloat(data['Technical Analysis: SMA'][key].SMA) < 100){
	        		let val = data['Technical Analysis: SMA'][key].SMA;
					retData.sma31.push(val)
	        	}else{
				    // console.log(data['Technical Analysis: SMA'][key])
		            retData.sma31.push(parseFloat(data['Technical Analysis: SMA'][key].SMA))
	        	}
	        }
	    }
	})
	await alpha.technical.sma(sym, 'daily', 41, 'close').then(data => {
		x = 0;
	    for(var key in data['Technical Analysis: SMA']){
	        x++
	        if(x < settings().length){
	        	if(parseFloat(data['Technical Analysis: SMA'][key].SMA) < 100){
	        		let val = data['Technical Analysis: SMA'][key].SMA;
					retData.sma41.push(val)
	        	}else{
				    // console.log(data['Technical Analysis: SMA'][key])
		            retData.sma41.push(parseFloat(data['Technical Analysis: SMA'][key].SMA))
	        	}
	        }
	    }
	})

	retData.sma11.reverse();
	retData.sma21.reverse();
	retData.sma31.reverse();
	retData.sma41.reverse();

	return retData;
}


module.exports = getSMA;

