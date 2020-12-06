const express = require('express')
const  app = express();
const chalk = require('chalk');
const main = require('./main.js');
const bodyParser = require('body-parser');
const fs = require('fs');

const startServer = () => {
	app.use(express.static('/'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
	    extended: true
	}));

	app.get('/watchlist', (req, res) => {
		res.sendFile(`${__dirname}/watchlist.txt`)
	})
	
	app.get('/', (req, res) => {
		res.sendFile(`${__dirname}/testFile.html`)
	})

	app.get('/about', (req, res) => {
		res.sendFile(`${__dirname}/about.html`)
	})

	app.post('/', (req, res) => {
		main(req.body.symbol)
		res.end('Done')
	})

	app.post('/addToWatchlist', (req, res) => {
		fs.readFile('watchlist.txt', (err, data) => {
			if(err){
				console.log(err)
			}else{
				let newWatchlist = data + ',' + req.body.symbol;
				fs.writeFile('watchlist.txt', newWatchlist, (err) => {
					if(err){
						console.log(err)
					}else{
						console.log(chalk.cyan('New watchlist created!'))
					}
				})
			}
		})
		res.end('Done')
	})

	app.listen(1235, () => {
		console.log(chalk.cyan('Server is started! \n\n To access the ATT, open your browser and go to "http://127.0.0.1:1235" or "http://localhost:1235'))
	})
}

startServer()