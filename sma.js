const getAPIkey = require('./getAlphavantageKey.js');
const alpha = require('alphavantage')({key :  `${getAPIkey()}`});



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
	        if(x < 100){
	        	//If price is below SMA is below 100
	        	if(parseInt(data['Technical Analysis: SMA'][key].SMA) < 100){
	        		let roundedVal = (Math.round(data['Technical Analysis: SMA'][key].SMA * 4) / 4).toFixed(2);
					retData.sma11.push(roundedVal)
	        	}else{
				    // console.log(data['Technical Analysis: SMA'][key])
		            retData.sma11.push(parseInt(data['Technical Analysis: SMA'][key].SMA))
	        	}
	        }
	    }
	})
	await alpha.technical.sma(sym, 'daily', 21, 'close').then(data => {
		x = 0;
	    for(var key in data['Technical Analysis: SMA']){
	        x++
	        if(x < 100){
	        	if(parseInt(data['Technical Analysis: SMA'][key].SMA) < 100){
	        		let roundedVal = (Math.round(data['Technical Analysis: SMA'][key].SMA * 4) / 4).toFixed(2);
					retData.sma21.push(roundedVal)
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
	        if(x < 100){
	        	if(parseInt(data['Technical Analysis: SMA'][key].SMA) < 100){
	        		let roundedVal = (Math.round(data['Technical Analysis: SMA'][key].SMA * 4) / 4).toFixed(2);
					retData.sma31.push(roundedVal)
	        	}else{
				    // console.log(data['Technical Analysis: SMA'][key])
		            retData.sma31.push(parseInt(data['Technical Analysis: SMA'][key].SMA))
	        	}
	        }
	    }
	})
	await alpha.technical.sma(sym, 'daily', 41, 'close').then(data => {
		x = 0;
	    for(var key in data['Technical Analysis: SMA']){
	        x++
	        if(x < 100){
	        	if(parseInt(data['Technical Analysis: SMA'][key].SMA) < 100){
	        		let roundedVal = (Math.round(data['Technical Analysis: SMA'][key].SMA * 4) / 4).toFixed(2);
					retData.sma41.push(roundedVal)
	        	}else{
				    // console.log(data['Technical Analysis: SMA'][key])
		            retData.sma41.push(parseInt(data['Technical Analysis: SMA'][key].SMA))
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

