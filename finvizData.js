const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const axios = require('axios')


const getFinvizData = async (symbol, ret) => {
	let allData = axios.get(`https://finviz.com/quote.ashx?t=${symbol}`)
	.then(data => {
		let dom = new JSDOM(data.data)

		let insiderOwn = dom.window.document.querySelector("body > div.content > div > table.snapshot-table2 > tbody > tr:nth-child(1) > td:nth-child(8) > b");
		let instOwn = dom.window.document.querySelector("body > div.content > div > table.snapshot-table2 > tbody > tr:nth-child(3) > td:nth-child(8) > b");
		let sector = dom.window.document.querySelector("body > div.content > div > table:nth-child(5) > tbody > tr:nth-child(2) > td > table.fullview-title > tbody > tr:nth-child(3) > td > a:nth-child(1)");
		let sharesOutstanding = dom.window.document.querySelector("body > div.content > div > table.snapshot-table2 > tbody > tr:nth-child(1) > td:nth-child(10) > b");
		let pe = dom.window.document.querySelector("body > div.content > div > table.snapshot-table2 > tbody > tr:nth-child(1) > td:nth-child(4) > b");
		let peg = dom.window.document.querySelector("body > div.content > div > table.snapshot-table2 > tbody > tr:nth-child(3) > td:nth-child(4) > b");
		let rvol = dom.window.document.querySelector("body > div.content > div > table.snapshot-table2 > tbody > tr:nth-child(10) > td:nth-child(10) > b");
		let avgVol = dom.window.document.querySelector("body > div.content > div > table.snapshot-table2 > tbody > tr:nth-child(11) > td:nth-child(10) > b");
		let vol = dom.window.document.querySelector("body > div.content > div > table.snapshot-table2 > tbody > tr:nth-child(12) > td:nth-child(10) > b");
		let price = dom.window.document.querySelector("body > div.content > div > table.snapshot-table2 > tbody > tr:nth-child(11) > td:nth-child(12) > b");
		let sma200 = dom.window.document.querySelector("body > div.content > div > table.snapshot-table2 > tbody > tr:nth-child(12) > td:nth-child(8) > b > span");
		
		let retData = {
			insiderOwn : insiderOwn.textContent,
			instOwn : instOwn.textContent,
			sector : sector.textContent,
			sharesOutstanding : sharesOutstanding.textContent,
			pe : pe.textContent,
			peg : peg.textContent,
			rvol : rvol.textContent,
			avgVol : avgVol.textContent,
			vol : vol.textContent,
			price : price.textContent,
			sma200 : sma200.textContent
		}; 
		return retData;
	})
	.catch(err => console.log(err))

	return allData;
}

module.exports = getFinvizData;
