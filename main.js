const getAPIkey = require('./getAlphavantageKey.js');
const alpha = require('alphavantage')({key : `${getAPIkey()}`});
const fs = require('fs');
const chalk = require('chalk');
const getSMA = require('./sma.js');
const getFinvizData = require('./finvizData.js');

const main = (symbol) => {

	alpha.data.daily(symbol).then(async data => {

		//Function to reduce arrays
		const reducer = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);

		//Wait for SMA results
		const sma = await getSMA(symbol)

		let stockData = {
			date : [],
			open : [],
			close : [],
			volume : [],
			avgVol : [],
			difference : []
		}

		let x = 1;


		for(var key in data['Time Series (Daily)']){
			//Date
			//console.log(key)
			stockData.date.push('"'+ key + '"')

			//Open price
			//console.log(data['Time Series (Daily)'][key]['1. open'])
			stockData.open.push(data['Time Series (Daily)'][key]['1. open'])

			//Closing price
			//console.log(data['Time Series (Daily)'][key]['4. close'])
			stockData.close.push(data['Time Series (Daily)'][key]['4. close'])

			//Volume
			//console.log(data['Time Series (Daily)'][key]['5. volume'])
			stockData.volume.push(data['Time Series (Daily)'][key]['5. volume'])

			//Average Volume
			stockData.avgVol.push(Math.floor(stockData.volume.reduce(reducer)/stockData.volume.length))

			//Difference between SMA and closing price
			x++
			let diff = (data['Time Series (Daily)'][key]['4. close'] - sma[x])
			let a = (sma[x]/diff)
			stockData.difference.push(a)

			
			
		}

		//Function to trigger a buy signal
		const buySignal = () => {
			let sum = (sma.sma11 + sma.sma21 + sma.sma31 + sma.sma41)/sma.sma11
			if(sum <= 4.01 && sum >= 3.99){
				return "'rgba(255, 99, 132, 1)'"
			}else{
				return "'rgba(255, 99, 132, 1)'"
			}
		}


		//Stats data from FinViz
		let finvizData = await getFinvizData(symbol)


		let htmlData = `
			<!DOCTYPE html>
			<html>
			<head>
			    <title>Allen's Trading Tool</title>
			    <meta name="Author" content="Conner Allen">
			    <meta name="viewport" content="width=device-width, initial-scale=1">
			    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
			    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js"></script>
			    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
				<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
			   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

			    <style type="text/css">

					#watchlistContainer{
						background-color: #a3a3a3;
						margin-left: 0%;
						height: 3%;
						width: 25%;
						position: fixed;
						transition: 0.5s;
						border-radius: 0px 0px 5px 0px;
						overflow-x: hidden;
						overflow-y: auto;
					}
					#hideBtn{
						color: #8f8f8f;
						margin-top: 15px;
						transition: 0.3s;
					}
					#hideBtn:hover{
						color: #575757;
					}

					#watchlistItem{
						transition: 0.3s;
					}
					#watchlistItem:hover{
						background-color: #7a7a7a;
						filter: brightness(70%);
						cursor: pointer;
					}

					#statsContainer{
						background-color: #a3a3a3;
						margin-left: 75%;
						height: 3%;
						width: 25%;
						position: fixed;
						transition: 0.5s;
						border-radius: 0px 0px 0px 5px;
						overflow-x: hidden;
						overflow-y: auto;
					}
					#hideBtn, #hideBtn2{
						color: #8f8f8f;
						margin-top: 15px;
						transition: 0.3s;
					}
					#hideBtn:hover, #hideBtn2:hover{
						color: #575757;
					}


			    	canvas{
						height: 203px;
						width: 203px;
			    	}
			    	body{
			    		text-align: center;
			    		background-color: #bababa;
			    		font-family: Verdana;
			    	}
				    form{
				    	margin-left: auto;
				    	margin-right: auto:
				    	text-align: center;
				    	padding-bottom: 20px;
				    }
				    #headerContainer{
						width: 100%;
						background-color: #636363;
						margin-top: 0px;
						text-align: center;
				    }
					h1{
						padding-top: 16px;
						text-decoration: underline;
					}
					#aboutContainer, #howContainer{
						width: 50%;
						margin-left: auto;
						margin-right: auto;
						text-align: center;
					}
					a:hover{
						cursor: pointer;
						text-decoration: underline; 
					}
					a{
						font-weight: bold;
					}
					#searchBtn{
						padding: 5px;
						padding-left: 23px;
						padding-right: 23px;
						margin-bottom: 10px;
						border-radius: 3px;
						background-color: transparent;
						border: 1px solid black;
						transition: 0.2s;
					}
					#searchBtn:hover{
						cursor: pointer;
						background-color: #8c8c8c;
					}

					#symbolSearchBox{
						width: 133px;
						height: 23px;
						border-radius: 3px;
					}

					.loader {
					  border: 16px solid #f3f3f3;
					  border-radius: 50%;
					  border-top: 16px solid #3498db;
					  width: 33px;
					  height: 33px;
					  -webkit-animation: spin 2s linear infinite; /* Safari */
					  animation: spin 2s linear infinite;
					  margin-left: auto;
					  margin-right: auto;
					}

					/* Safari */
					@-webkit-keyframes spin {
					  0% { -webkit-transform: rotate(0deg); }
					  100% { -webkit-transform: rotate(360deg); }
					}

					@keyframes spin {
					  0% { transform: rotate(0deg); }
					  100% { transform: rotate(360deg); }
					}
			    </style>
			</head>
			<body>
				<div id="headerContainer">

					<div id="watchlistContainer">
						<div class="contianer" id="watchlistContainer2">
							<div class="row">
								<div class="col-sm-10">
									<b style="text-decoration:underline; padding: 5px; margin-left: 20%">Watchlist</b>
								</div>
								<div class="col-sm-2">
									<a id="hideBtn" onclick="toggleWatchlist()">Show</a>
								</div>
							</div>
						</div>
					</div>

					<div id="statsContainer">
						<div class="contianer" id="statsContainer2">
							<div class="row">
								<div class="col-sm-10">
									<b style="text-decoration:underline; padding: 5px; margin-left: 20%">Stats</b>
								</div>
								<div class="col-sm-2">
									<a id="hideBtn2" onclick="toggleStats()">Show</a>
								</div>
							</div>

							<div class="row" style="margin-top: 23px; border-bottom: 1px solid black;">
								<div class="col-lg-12" id="statCell"> 
									<div class="row">
										<div class="col-lg-6">
											<b>Price</b>
										</div>
										<div class="col-lg-6" style="border-left: 1px solid black">
											${finvizData.price}
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="border-bottom: 1px solid black;">
								<div class="col-lg-12" id="statCell"> 
									<div class="row">
										<div class="col-lg-6">
											<b>Sector</b>
										</div>
										<div class="col-lg-6" style="border-left: 1px solid black">
											${finvizData.sector}
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="border-bottom: 1px solid black;">
								<div class="col-lg-12" id="statCell"> 
									<div class="row">
										<div class="col-lg-6">
											<b>Volume</b>
										</div>
										<div class="col-lg-6" style="border-left: 1px solid black">
											${finvizData.vol}
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="border-bottom: 1px solid black;">
								<div class="col-lg-12" id="statCell"> 
									<div class="row">
										<div class="col-lg-6">
											<b>Avg. Volume</b>
										</div>
										<div class="col-lg-6" style="border-left: 1px solid black">
											${finvizData.avgVol}
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="border-bottom: 1px solid black;">
								<div class="col-lg-12" id="statCell"> 
									<div class="row">
										<div class="col-lg-6">
											<b>Rel. Volume</b>
										</div>
										<div class="col-lg-6" style="border-left: 1px solid black">
											${finvizData.rvol}
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="border-bottom: 1px solid black;">
								<div class="col-lg-12" id="statCell"> 
									<div class="row">
										<div class="col-lg-6">
											<b>Shares Outstanding</b>
										</div>
										<div class="col-lg-6" style="border-left: 1px solid black">
											${finvizData.sharesOutstanding}
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="border-bottom: 1px solid black;">
								<div class="col-lg-12" id="statCell"> 
									<div class="row">
										<div class="col-lg-6">
											<b>P/E</b>
										</div>
										<div class="col-lg-6" style="border-left: 1px solid black">
											${finvizData.pe}
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="border-bottom: 1px solid black;">
								<div class="col-lg-12" id="statCell"> 
									<div class="row">
										<div class="col-lg-6">
											<b>PEG</b>
										</div>
										<div class="col-lg-6" style="border-left: 1px solid black">
											${finvizData.peg}
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="border-bottom: 1px solid black;">
								<div class="col-lg-12" id="statCell"> 
									<div class="row">
										<div class="col-lg-6">
											<b>Insider Own</b>
										</div>
										<div class="col-lg-6" style="border-left: 1px solid black">
											${finvizData.insiderOwn}
										</div>
									</div>
								</div>
							</div>
							<div class="row" style="border-bottom: 1px solid black;">
								<div class="col-lg-12" id="statCell"> 
									<div class="row">
										<div class="col-lg-6">
											<b>Institutional Own</b>
										</div>
										<div class="col-lg-6" style="border-left: 1px solid black">
											${finvizData.instOwn}
										</div>
									</div>
								</div>
							</div>
								<div class="row" style="border-bottom: 1px solid black;">
								<div class="col-lg-12" id="statCell"> 
									<div class="row">
										<div class="col-lg-6">
											<b>sma200</b>
										</div>
										<div class="col-lg-6" style="border-left: 1px solid black">
											${finvizData.sma200}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<h1>Allen's Trading Tool</h1>
					<h3>Created By: Conner Allen</h3>
					<a onclick="showText('about')">About</a><br><br>
					<div id="aboutContainer">
						<p id="aboutText" style="display: none;">
							The Allen's Trading Tool (ATT) is a combination of 4 Simple Moving Averages 
							plotted together on a line chart. The values are based on the closing price of the daily time 
							frame. Each value is also rounded off, this makes the lines have more of a "stepping" pattern rather than 
							a "smooth" one. <br><br>
							
							When the deviance between the 4 averages is less than 1% then this usually leads to big changes in 
							price movement. This is in relation to how price action behaves. Price action will make dramatic moves 
							followed by consolidation, then another big move. The lower deviance between averages means that a stock 
							is in the consolidation phase and a big move is likely to follow. <br><br>

							Thus, this indicator will place a buy signal (green cross) whenever the deviance between the 4 averages is
							at a point of tight consolidation.  <br><br>

							<a href="/about">More About</a><br><br>
						</p>
					</div>
					<a onclick="showText('how')">How to Use</a><br>
					<div id="howContainer">
						<p id="howText" style="display: none;">
							This tool is quite easy to use. It will place different colored crosses as points of possible entry/exit. A green
							cross = buy signal, a red cross = sell signal / downtrend, and a large golden cross = possible reversal / buy signal <br><br>

							The most important thing to remember is that only 1 green cross IS NOT a buy signal. 
							A buy signal is confirmed after 2 or more consecutive crosses are placed.<br><br>

							You might also want to see where price action is in relation to the 11MA (the top chart). If you see
							2 or more consecutive green crosses AND price action is above the 11MA, then the buy signal is a lot more reliable. <br><br>

							If you see 2 or more consecutive green crosses and price action is below the 11Ma, then there is a higher possibility 
							of false flags.<br><br>

							Keep in mind that these signals are not 100% accurate, just as any other indicator or tool. Although I have seen countless 
							buy signals that lead to large moves in price action.<br><br>  
						</p><br><br>
					</div>

					<form method="POST" action="/">
						<input type="text" placeholder="SYMBOL" id="symbolSearchBox"></input>
					</form>
					<button id="searchBtn" onclick="searchSymbol()" >Submit</button>
					<div id="loader" class="loaderOff"></div>
				</div>

				<canvas id="myChart" width="300" height="100"></canvas>
				<canvas id="myChart2" width="150" height="50"></canvas>
				
				<script>

					const getTickers = () => {
						axios.get('/watchlist')
						.then(data => {
							createWatchlist(data.data.toString().split(','))
						})
						.catch(err => console.log(err));
					}

					getTickers()

					const createWatchlist = (tickers) => {
						//Get parent element (watchlist container) to append watchlist items into
						let parentElm = document.querySelector('#watchlistContainer2');

						tickers.forEach((item, index) => {
							let row = document.createElement('div');
							row.className = 'row';
							let cell = document.createElement('div');
							cell.className = 'col-sm-12';
							cell.id = 'watchlistItem';
							cell.style.padding = '10px';
							cell.style.borderBottom = '1px solid black';
							cell.style.display = 'none';
							cell.style.width = '90%';
							cell.addEventListener('click', () => {
								document.querySelector('.loaderOff').className = 'loader'
								axios.post('/', {symbol : document.querySelector('#watchlistText' + index).textContent})
								setTimeout(() => {window.location = window.location}, 10000)
							})
							let text = document.createElement('a');
							text.id = 'watchlistText' + index;
							text.textContent = item;

							parentElm.appendChild(row);
							row.appendChild(cell);
							cell.appendChild(text);

						})

						//Form for adding another ticker to watchlist
						let addTickerForm = document.createElement('form');
						addTickerForm.method = 'POST';
						addTickerForm.action = '/';
						let addTickerInput = document.createElement('input');
						addTickerInput.type = 'text';
						addTickerInput.id = 'addTickerSymbol'
						addTickerInput.placeholder = 'SYMBOL';
						let addTickerBtn = document.createElement('button')
						addTickerBtn.textContent = 'Submit';
						addTickerBtn.addEventListener('click', () => {
							axios.post('/addToWatchlist', {symbol: document.querySelector('#addTickerSymbol').value})
							setTimeout(() => {
								window.location = window.location;
							}, 3000)
						})

						//Last cell for adding another ticker to watchlist
						let lastRow = document.createElement('div');
						lastRow.className = 'row';
						let lastCell = document.createElement('div');
						lastCell.className = 'col-sm-12';
						lastCell.id = 'watchlistItem';
						lastCell.style.padding = '10px';
						lastCell.style.borderBottom = '1px solid black';
						lastCell.style.display = 'none';
						let lastText = document.createElement('a');
						lastText.id = 'lastText'
						lastText.textContent = '+';
						lastText.addEventListener('click', (e) => {
							document.querySelector('#lastText').textContent = '';

							lastCell.appendChild(addTickerForm);
							lastCell.appendChild(addTickerInput);
							lastCell.appendChild(addTickerBtn);
						})

						parentElm.appendChild(lastRow);
						lastRow.appendChild(lastCell);
						lastCell.appendChild(lastText);

					}

					//For hiding and showing the wacthlist
					const toggleWatchlist = () => {
						let btn = document.querySelector('#hideBtn')
						if(btn.textContent == 'Hide'){
							document.querySelector('#watchlistContainer').style.height = '3%';
							document.querySelectorAll('#watchlistItem').forEach(item => {
								item.style.display = 'none';
							});
							btn.textContent = 'Show';
							return
						}
						if(btn.textContent == 'Show'){
							document.querySelector('#watchlistContainer').style.height = '29.7%';
							document.querySelectorAll('#watchlistItem').forEach(item => {
								item.style.display = 'inline';
							});
							btn.textContent = 'Hide';
							return
						}
					}

					const toggleStats = () => {
						let btn = document.querySelector('#hideBtn2')
						if(btn.textContent == 'Hide'){
							document.querySelector('#statsContainer').style.height = '3%';
							document.querySelectorAll('#statsItem').forEach(item => {
								item.style.display = 'none';
							});
							btn.textContent = 'Show';
							return
						}
						if(btn.textContent == 'Show'){
							document.querySelector('#statsContainer').style.height = '29.7%';
							document.querySelectorAll('#statsItem').forEach(item => {
								item.style.display = 'inline';
							});
							btn.textContent = 'Hide';
							return
						}
					}


					var xa = 0
					const showText = (type) => {
						xa++
						//check if the number is even
						if(xa % 2 == 0) {
						    if(type == 'about'){
								document.querySelector('#aboutText').style.display = 'none';
							}
							if(type == 'how'){
								document.querySelector('#howText').style.display = 'none';
							}
						}

						// if the number is odd
						else {
						    if(type == 'about'){
								document.querySelector('#aboutText').style.display = 'inline';
							}
							if(type == 'how'){
								document.querySelector('#howText').style.display = 'inline';
							}
						}
					}

					var ctx = document.getElementById('myChart');
					var myChart = new Chart(ctx, {
					    type: 'line',
					    data: {
					    	labels: [${stockData.date.reverse()}],
					    	datasets: [{
						    	data: [${stockData.close.reverse()}],
						    	label: '${symbol} PRICE',
						    	borderColor:  'rgba(255, 99, 132, 1)',
						    	fill: true
						    },
						    {
						    	data: [${sma.sma11}],
						    	label: '${symbol} SMA11',
						    	borderColor:  'rgba(50, 168, 82)',
						    	fill: true
						    }],
					    }
					});

					var ctx2 = document.getElementById('myChart2');
					var myChart2 = new Chart(ctx2, {
					    type: 'line',
					    data: {
					    	labels: [${stockData.date}],
					    	datasets: [{
						    	data: [${sma.sma11}],
						    	label: '${symbol} SMA11',
						    	borderColor: (context) => {
									if([${sma.sma11}][context.dataIndex] < [${sma.sma11}][context.dataIndex - 1]){
										return 'rgba(176, 28, 28)'
						    		}else{
						    			//Reversal signal
							    		if([${sma.sma11}][context.dataIndex - 1] < [${sma.sma11}][context.dataIndex - 2]){
											if([${sma.sma11}][context.dataIndex ] >= [${sma.sma11}][context.dataIndex - 1]){
												return 'rgba(252, 232, 3)'
								    		}
							    		}
						    			return 'rgba(90, 212, 53)'
						    		}
						    	},
						    	fill: true,
						    	pointStyle : (context) => {
						    		let sma11Val = [${sma.sma11}][context.dataIndex];
						    		let sma21Val = [${sma.sma21}][context.dataIndex];
						    		let sma31Val = [${sma.sma31}][context.dataIndex];
						    		let sma41Val = [${sma.sma41}][context.dataIndex];

						    		let sum = (sma11Val + sma21Val + sma31Val + sma41Val)/sma11Val
									
									//Sell signal
						    		if([${sma.sma11}][context.dataIndex] < [${sma.sma11}][context.dataIndex - 1]){
										return 'cross'
						    		}

									//Reversal signal
						    		if([${sma.sma11}][context.dataIndex - 1] < [${sma.sma11}][context.dataIndex - 2]){
										if([${sma.sma11}][context.dataIndex ] >= [${sma.sma11}][context.dataIndex - 1]){
											return 'cross'
							    		}
						    		}

									//Buy signal
						    		if(sum >= 3.99 && sum <= 4.01){
										return 'cross'
						    		}
									
						    	},
						    	pointRadius : (context) => {
						    		let sma11Val = [${sma.sma11}][context.dataIndex];
						    		let sma21Val = [${sma.sma21}][context.dataIndex];
						    		let sma31Val = [${sma.sma31}][context.dataIndex];
						    		let sma41Val = [${sma.sma41}][context.dataIndex];

						    		let sum = (sma11Val + sma21Val + sma31Val + sma41Val)/sma11Val

						    		if([${sma.sma11}][context.dataIndex] < [${sma.sma11}][context.dataIndex - 1]){
										return 50;
						    		}

						    		//Reversal signal
						    		if([${sma.sma11}][context.dataIndex - 1] < [${sma.sma11}][context.dataIndex - 2]){
										if([${sma.sma11}][context.dataIndex ] >= [${sma.sma11}][context.dataIndex - 1]){
											return 100
							    		}
						    		}

						    		if(sum >= 3.99 && sum <= 4.01){
										return 50
						    		}
									
						    	}
						    },
						    {
						    	data: [${sma.sma21}],
						    	label: '${symbol} SMA21',
						    	borderColor:  'rgba(50, 98, 168)',
						    	fill: true 
						    },
						    {
						    	data: [${sma.sma31}],
						    	label: '${symbol} SMA31',
						    	borderColor:  'rgba(125, 35, 105)',
						    	fill: true 
						    },
						    {
						    	data: [${sma.sma41}],
						    	label: '${symbol} SMA41',
						    	borderColor:  'rgba(255, 99, 132, 1)',
						    	fill: true 
						    }
						    ],
					    }
					})




					const searchSymbol = () => {

						let sb = document.querySelector('#symbolSearchBox'); 

						if(sb.value !== '' && sb.value !== undefined && sb.value !== null){
							document.querySelector('.loaderOff').className = 'loader'
							axios.post('/', {symbol : sb.value})
							setTimeout(() => {window.location = window.location}, 10000)
						}else{
							alert('Please enter a symbol in the input box.')
						}

					}
				</script>
			</body>
			</html>
		`

		//Create chart
		fs.writeFile('testFile.html', htmlData, (err) => {
			if(err){
				console.log(err)
			}else{
				console.log(chalk.cyan('Done!'))
			}
		})
	});
}

module.exports = main;