const express = require('express');
const consign = require('consign');
const { join } = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.set('view engine', 'twig');
app.set('views', join(process.cwd(), "./src/views"))

app.use('/static', express.static('./static'));

app.use('/api', bodyParser.urlencoded({ extended: false, limit: "100mb" }))
app.use('/api', bodyParser.json({ limit: "100mb" }))

app.config = require('./config.json');

consign()
  .include('src/models')
  .then('src/controllers')
  .then('src/routers')
  .into(app);
let args = [app.config.port];
if(app.config.domain){
  args.push(app.config.domain);
}
if(app.config.useSSL){
  const https = require('https');
  let certificate = fs.readFileSync(app.config.ssl.cert, 'utf8');
  let privateKey  = fs.readFileSync(app.config.ssl.key, 'utf8');
  let credentials = {key: privateKey, cert: certificate};
  if(app.config.ssl.port){
    const http = require('http');
    let httpServer = http.createServer(app);
    let httpsServer = https.createServer(credentials, app);
	const httpPort = args[0]
    httpServer.listen(...args, () => {
		console.log("Servidor http rodando na porta " + httpPort);
	});
    args[0] = app.config.ssl.port;
    httpsServer.listen(...args, () => {
		console.log("Servidor https rodando na porta " + args[0]);
	});
  }else{
    let httpsServer = https.createServer(credentials, app);
    httpsServer.listen(...args, () => {
		console.log("Servidor http rodando na porta " + args[0]);
	});
  }
}else{
  app.listen(...args);
}