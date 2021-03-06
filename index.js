//MODULOS
var express = require("express");
var cool = require("cool-ascii-faces");
var path = require("path");
var bodyParser = require('body-parser');
const { Console } = require("console");
var request = require("request");
var cors = require("cors");

//VARIABLES PARA LOS SERVIDORES
var app = express();
var BASE_API_PATH = "/api/v1";
var port = process.env.PORT || 10000;

// base de datos awards 
var Datastore = require("nedb");
var awardsFile = path.join(__dirname, "./src/back/awards/awards.db");
var dbAwards = new Datastore({filename : awardsFile, autoload : true});

/*
// base de datos platforms 
var DatastorePlatforms = require("nedb");
var platformsFile = path.join(__dirname, "platforms/platforms.db");
var dbPlatforms = new DatastorePlatforms({filename : platformsFile, autoload : true});
*/

//USOS DEL SERVIDOR
app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());


//Recurso /cool - F02
app.get("/cool", (request, response) => {
  response.send(cool());
  console.log("new request to /cool has arrived");
});


//Recurso /info - F03
app.get("/info/platforms", (req, res) => {
	res.send("<html><body><h1></h1><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><link type='text/css' rel='stylesheet' href='resources/sheet.css' ><style type='text/css'>.ritz .waffle a { color: inherit; }.ritz .waffle .s1{background-color:#f8f9fa;text-align:center;color:#202124;font-family:'docs-Montserrat',Arial;font-size:10pt;vertical-align:bottom;white-space:normal;overflow:hidden;word-wrap:break-word;direction:ltr;padding:0px 3px 0px 3px;}.ritz .waffle .s0{background-color:#f3f3f3;text-align:center;font-weight:bold;font-style:italic;color:#000000;font-family:'docs-Calibri',Arial;font-size:10pt;vertical-align:bottom;white-space:nowrap;direction:ltr;padding:0px 3px 0px 3px;}.ritz .waffle .s2{background-color:#f3f3f3;text-align:center;color:#000000;font-family:'docs-Montserrat',Arial;font-size:10pt;vertical-align:bottom;white-space:nowrap;direction:ltr;padding:0px 3px 0px 3px;}</style><h1>Últimas cifras de ventas de consolas por países</h1><div class='ritz grid-container' dir='ltr'><table class='waffle' cellspacing='0' cellpadding='0'><thead><tr><th class='row-header freezebar-origin-ltr'></th><th id='45584241C0' style='width:100px;' class='column-headers-background'></th><th id='45584241C1' style='width:100px;' class='column-headers-background'></th><th id='45584241C2' style='width:100px;' class='column-headers-background'></th><th id='45584241C3' style='width:100px;' class='column-headers-background'></th><th id='45584241C4' style='width:100px;' class='column-headers-background'></th></tr></thead><tbody><tr style='height: 20px'><th id='45584241R0' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s0' dir='ltr'>country</td><td class='s0' dir='ltr'>platform</td><td class='s0' dir='ltr'>year</td><td class='s0' dir='ltr'>sold-unit</td><td class='s0' dir='ltr'>generation</td></tr><tr style='height: 20px'><th id='45584241R1' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s1' dir='ltr'>Japan</td><td class='s2' dir='ltr'>Nintendo 3DS</td><td class='s2' dir='ltr'>2016</td><td class='s2' dir='ltr'>202885</td><td class='s2' dir='ltr'>8</td></tr><tr style='height: 20px'><th id='45584241R2' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>U.S</td><td class='s2' dir='ltr'>Nintendo 3DS</td><td class='s2' dir='ltr'>2015</td><td class='s2' dir='ltr'>15000000</td><td class='s2' dir='ltr'>8</td></tr><tr style='height: 20px'><th id='45584241R3' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>UK</td><td class='s2' dir='ltr'>PlayStation4</td><td class='s2' dir='ltr'>2016</td><td class='s2' dir='ltr'>3000000</td><td class='s2' dir='ltr'>8</td></tr><tr style='height: 20px'><th id='45584241R4' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th>	<td class='s2' dir='ltr'>Germany</td><td class='s2' dir='ltr'>PlayStation4</td><td class='s2' dir='ltr'>2015</td><td class='s2' dir='ltr'>2800000</td><td class='s2' dir='ltr'>8</td></tr><tr style='height: 20px'><th id='45584241R5' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>Spain</td><td class='s2' dir='ltr'>Nintendo 3DS</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>900000</td><td class='s2' dir='ltr'>8</td></tr><tr style='height: 20px'><th id='45584241R6' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>France</td><td class='s2' dir='ltr'>Nintendo 3DS</td><td class='s2' dir='ltr'>2015</td><td class='s2' dir='ltr'>4000000</td><td class='s2' dir='ltr'>8</td></tr><tr style='height: 20px'><th id='45584241R7' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>Portugal</td><td class='s2' dir='ltr'>PlayStation4</td><td class='s2' dir='ltr'>2015</td><td class='s2' dir='ltr'>100000</td><td class='s2' dir='ltr'>8</td></tr><tr style='height: 20px'><th id='45584241R8' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>China</td><td class='s2' dir='ltr'>PlayStation4</td><td class='s2' dir='ltr'>2015</td><td class='s2' dir='ltr'>73112</td><td class='s2' dir='ltr'>8</td></tr></tbody></table></div></body></html>");
});


app.get("/info/games", (req, res) => {
	res.send("<html><body><h1><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><link type='text/css' rel='stylesheet' href='resources/sheet.css' ><style type='text/css'>.ritz .waffle a { color: inherit; }.ritz .waffle .s4{border-left: none;background-color:#f3f3f3;text-align:center;color:#000000;font-family:'docs-Calibri',Arial;font-size:10pt;vertical-align:bottom;white-space:nowrap;direction:ltr;padding:0px 3px 0px 3px;}.ritz .waffle .s5{border-left: none;border-right: none;background-color:#f3f3f3;text-align:center;color:#000000;font-family:'docs-Calibri',Arial;font-size:10pt;vertical-align:bottom;white-space:nowrap;direction:ltr;padding:0px 3px 0px 3px;}.ritz .waffle .s2{background-color:#f3f3f3;text-align:center;color:#000000;font-family:'docs-Calibri',Arial;font-size:10pt;vertical-align:bottom;white-space:nowrap;direction:ltr;padding:0px 3px 0px 3px;}.ritz .waffle .s1{background-color:#f3f3f3;text-align:center;font-weight:bold;font-style:italic;color:#000000;font-family:'docs-Calibri',Arial;font-size:10pt;vertical-align:bottom;white-space:nowrap;direction:ltr;padding:0px 3px 0px 3px;}.ritz .waffle .s3{border-right: none;background-color:#f3f3f3;text-align:center;color:#000000;font-family:'docs-Calibri',Arial;font-size:10pt;vertical-align:bottom;white-space:nowrap;direction:ltr;padding:0px 3px 0px 3px;}.ritz .waffle .s0{border-left: none;background-color:#f3f3f3;text-align:center;font-weight:bold;font-style:italic;color:#000000;font-family:'docs-Calibri',Arial;font-size:10pt;vertical-align:bottom;white-space:nowrap;direction:ltr;padding:0px 3px 0px 3px;}</style><div class='ritz grid-container' dir='ltr'><table class='waffle' cellspacing='0' cellpadding='0'><thead><tr><th class='row-header freezebar-vertical-handle'></th><th id='667844323C0' style='width:93px;' class='column-headers-background'>A</th><th id='667844323C1' style='width:173px;' class='column-headers-background'>B</th><th id='667844323C2' style='width:93px;' class='column-headers-background'>C</th><th id='667844323C3' style='width:111px;' class='column-headers-background'>D</th><th id='667844323C4' style='width:93px;' class='column-headers-background'>E</th></tr></thead><tbody><tr style='height: 20px'><th id='667844323R0' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'>1</div></th><td class='s0 softmerge' dir='ltr'><div class='softmerge-inner' style='width:98px;left:-9px'>country</div></td><td class='s1' dir='ltr'>game</td><td class='s1' dir='ltr'>year</td><td class='s1' dir='ltr'>sold-unit</td><td class='s1' dir='ltr'>company</td></tr><tr><th style='height:3px;' class='freezebar-cell freezebar-horizontal-handle'></th><td class='freezebar-cell'></td><td class='freezebar-cell'></td><td class='freezebar-cell'></td><td class='freezebar-cell'></td><td class='freezebar-cell'></td></tr><tr style='height: 20px'><th id='667844323R1' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'>2</div></th><td class='s2' dir='ltr'>Japan</td><td class='s2' dir='ltr'>Super Mario Bros.</td><td class='s2' dir='ltr'>1985</td><td class='s2' dir='ltr'>40240000</td><td class='s2' dir='ltr'>Nintendo</td></tr><tr style='height: 20px'><th id='667844323R2' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'>3</div></th><td class='s3' dir='ltr'>Japan</td><td class='s4 softmerge' dir='ltr'><div class='softmerge-inner' style='width:172px;left:-3px'>Pokemon Gold/Silver/Crystal</div></td><td class='s2' dir='ltr'>1999</td><td class='s2' dir='ltr'>31380000</td><td class='s2' dir='ltr'>Game Freak</td></tr><tr style='height: 20px'><th id='667844323R3' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'>4</div></th><td class='s3' dir='ltr'>EEUU</td><td class='s4 softmerge' dir='ltr'><div class='softmerge-inner' style='width:172px;left:-3px'>Call of Duty Modern Warfare 3</div></td><td class='s2' dir='ltr'>2011</td><td class='s2' dir='ltr'>26500000</td><td class='s2' dir='ltr'>Activision</td></tr><tr style='height: 20px'><th id='667844323R4' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'>5</div></th><td class='s3' dir='ltr'>EEUU</td><td class='s4 softmerge' dir='ltr'><div class='softmerge-inner' style='width:172px;left:-3px'>Grand Theft Auto San Andreas</div></td><td class='s2' dir='ltr'>2004</td><td class='s3' dir='ltr'>27500000</td><td class='s5 softmerge' dir='ltr'><div class='softmerge-inner' style='width:193px;left:-3px'>Rockstar Games</div></td></tr><tr style='height: 20px'><th id='667844323R5' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'>6</div></th><td class='s2' dir='ltr'>EEUU</td><td class='s2' dir='ltr'>The Sims 2</td><td class='s2' dir='ltr'>2004</td><td class='s2' dir='ltr'>20000000</td><td class='s2' dir='ltr'>Electronic Arts</td></tr><tr style='height: 20px'><th id='667844323R6' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'>7</div></th><td class='s2' dir='ltr'>Sweden</td><td class='s2' dir='ltr'>Minecraft</td><td class='s2' dir='ltr'>2011</td><td class='s2' dir='ltr'>200000000</td><td class='s2' dir='ltr'>Mojang</td></tr><tr style='height: 20px'><th id='667844323R7' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'>8</div></th><td class='s2' dir='ltr'>EEUU</td><td class='s2' dir='ltr'>FIFA 18</td><td class='s2' dir='ltr'>2017</td><td class='s2' dir='ltr'>24000000</td><td class='s2' dir='ltr'>EA Sports</td></tr><tr style='height: 20px'><th id='667844323R8' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'>9</div></th><td class='s2' dir='ltr'>EEUU</td><td class='s2' dir='ltr'>Terraria</td><td class='s2' dir='ltr'>2011</td><td class='s2' dir='ltr'>20000000</td><td class='s2' dir='ltr'>505 Games</td></tr></tbody></table></div></h1></body></html>");
});


app.get("/info/awards", (req, res) =>{
	res.send("<html><body><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><link type='text/css' rel='stylesheet' href='resources/sheet.css' ><style type='text/css'>.ritz .waffle a { color: inherit; }.ritz .waffle .s1{background-color:#f8f9fa;text-align:center;color:#202124;font-family:'docs-Montserrat',Arial;font-size:10pt;vertical-align:bottom;white-space:normal;overflow:hidden;word-wrap:break-word;direction:ltr;padding:0px 3px 0px 3px;}.ritz .waffle .s0{background-color:#f3f3f3;text-align:center;font-weight:bold;font-style:italic;color:#000000;font-family:'docs-Calibri',Arial;font-size:10pt;vertical-align:bottom;white-space:nowrap;direction:ltr;padding:0px 3px 0px 3px;}.ritz .waffle .s2{background-color:#f3f3f3;text-align:center;color:#000000;font-family:'docs-Montserrat',Arial;font-size:10pt;vertical-align:bottom;white-space:nowrap;direction:ltr;padding:0px 3px 0px 3px;}</style><h1>Premios obtenidos de un videojuego</h1><div class='ritz grid-container' dir='ltr'><table class='waffle' cellspacing='0' cellpadding='0'><thead><tr><th class='row-header freezebar-origin-ltr'></th><th id='45584241C0' style='width:100px;' class='column-headers-background'></th><th id='45584241C1' style='width:100px;' class='column-headers-background'></th><th id='45584241C2' style='width:100px;' class='column-headers-background'></th><th id='45584241C3' style='width:100px;' class='column-headers-background'></th><th id='45584241C4' style='width:100px;' class='column-headers-background'></th><th id='45584241C5' style='width:100px;' class='column-headers-background'></th></tr></thead><tbody><tr style='height: 20p'><th id='45584241R0' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s0' dir='ltr'>country</td><td class='s0' dir='ltr'>year</td><td class='s0' dir='ltr'>gala</td><td class='s0' dir='ltr'>winner</td><td class='s0' dir='ltr'>n-platform</td><td class='s0' dir='ltr'>n-award</td></tr><tr style='height: 20px'><th id='45584241R1' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s1' dir='ltr'>Francia</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>Valiant Hearts: The Great War</td><td class='s2' dir='ltr'>7</td><td class='s2' dir='ltr'>2</td></tr><tr style='height: 20px'><th id='45584241R2' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>Canadá</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>Dragon Age: Inquisition</td><td class='s2' dir='ltr'>5</td><td class='s2' dir='ltr'>2</td></tr><tr style='height: 20px'><th id='45584241R3' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>USA</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>Shovel Knight</td><td class='s2' dir='ltr'>3</td><td class='s2' dir='ltr'>1</td></tr><tr style='height: 20px'><th id='45584241R4' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>USA</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>Hearthstone: Heroes of Warcraft</td><td class='s2' dir='ltr'>3</td><td class='s2' dir='ltr'>1</td></tr><tr style='height: 20px'><th id='45584241R5' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>Canada</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>Child of Light</td><td class='s2' dir='ltr'>7</td><td class='s2' dir='ltr'>1</td></tr><tr style='height: 20px'><th id='45584241R6' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>Reino Unido</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>Alien: Isolation</td><td class='s2' dir='ltr'>6</td><td class='s2' dir='ltr'>1</td></tr><tr style='height: 20px'><th id='45584241R7' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>USA</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>Destiny</td><td class='s2' dir='ltr'>4</td><td class='s2' dir='ltr'>2</td></tr><tr style='height: 20px'><th id='45584241R8' style='height: 20px;' class='row-headers-background'><div class='row-header-wrapper' style='line-height: 20px'></div></th><td class='s2' dir='ltr'>USA</td><td class='s2' dir='ltr'>2013</td><td class='s2' dir='ltr'>2014</td><td class='s2' dir='ltr'>Grand Theft Auto V</td><td class='s2' dir='ltr'>4</td><td class='s2' dir='ltr'>1</td></tr></tbody></table></div></body></html>");
});

//F05 -----------> MODULAR LAS APIS

// API AWARDS

var apiAwards = require("./src/back/awards");
apiAwards.register(app,dbAwards);

//API PLATFORMS

var apiPlatforms =  require("./src/back/platforms");
apiPlatforms.register(app);



//F05 -----------> MODULAR LAS APIS

// API GAMES

var apiGames = require("./src/back/games");
apiGames.register(app);


//Pruebas
app.post("/hello", (req, res) => {
	res.send("<html><body><h1>POST Hello from this tiny server</h1></body></html>");
});


app.get('/index', (request, response) => {
    response.send(express());
    console.log('New request to /index has arrived, succesfuly');
});

//Marina
//Uso 1 API suicidios (GRUPO 01) (PROXY)
//el servidor de datos se encontraría en apiServerHostQL
// "/proxi-life" es la ruta dónde decido configurar el recurso
//esto lo que va a hacer es que cada vez que llamemos a "/proxi-life",
//será como si llamaramos a la variable apiServerHostQL.
//se define una var url que tendrá la ruta de la api + url original


app.use("/proxy-life", function(req, res) {
    var apiServerHostQL = 'http://sos2021-01.herokuapp.com';
    var url = apiServerHostQL + req.url;
    //var url = api05 + req.baseUrl  + req.url;
	console.log('piped: /proxy -> ' + url);
    // request solo hace get, investigar como hacer put, post, delete, etc.
    req.pipe(request(url)).pipe(res);
});

//Marina
//Uso 1 API suicidios (GRUPO 01) (PROXY)
//el servidor de datos se encontraría en apiServerHostQL
// "/proxi-life" es la ruta dónde decido configurar el recurso
//esto lo que va a hacer es que cada vez que llamemos a "/proxi-life",
//será como si llamaramos a la variable apiServerHostQL.
//se define una var url que tendrá la ruta de la api + url original


app.use("/proxy-princesa", function(req, res) {
    var apiServerHostQL = 'http://sos2021-22.herokuapp.com';
    var url = apiServerHostQL + req.url;
    //var url = api05 + req.baseUrl  + req.url;
	console.log('piped: /proxy -> ' + url);
    // request solo hace get, investigar como hacer put, post, delete, etc.
    req.pipe(request(url)).pipe(res);
});


//Marina
//Uso 1 API suicidios (GRUPO 05) (PROXY)
//el servidor de datos se encontraría en apiServerHostQL
// "/proxi-armas" es la ruta dónde decido configurar el recurso
//esto lo que va a hacer es que cada vez que llamemos a "/ql",
//será como si llamaramos a la variable apiServerHostQL.
//se define una var url que tendrá la ruta de la api + url original



var api05 = "http://sos2021-05.herokuapp.com";
var path05 = "/api/v1/arms-sales-stats";

app.use("/proxy-armas", function(req, res) {
    var apiServerHostQL = 'http://sos2021-05.herokuapp.com';
    var url = apiServerHostQL + req.url;
    //var url = api05 + req.baseUrl  + req.url;
	console.log('piped: /proxy -> ' + url);
    // request solo hace get, investigar como hacer put, post, delete, etc.
    req.pipe(request(url)).pipe(res);
});

//Marina
//Uso 1 API suicidios (GRUPO 05) (PROXY)
//el servidor de datos se encontraría en apiServerHostQL
// "/proxi-suicidios" es la ruta dónde decido configurar el recurso
//esto lo que va a hacer es que cada vez que llamemos a "/ql",
//será como si llamaramos a la variable apiServerHostQL.
//se define una var url que tendrá la ruta de la api + url original



app.use("/proxy-suicidios", function(req, res) {
    var apiServerHostQL = 'http://sos2021-27.herokuapp.com';
    var url = apiServerHostQL + req.url;
    //var url = api05 + req.baseUrl  + req.url;
	console.log('piped: /proxy -> ' + url);
    // request solo hace get, investigar como hacer put, post, delete, etc.
    req.pipe(request(url)).pipe(res);
});

//Jose Proxy API grupo 27 (inversión en promoción social)
app.use("/proxy-social", function(req, res) {
    var apiServer = 'http://sos2021-27.herokuapp.com';
    var urlAward = apiServer + req.url;
    console.log('piped: /proxy -> ' + urlAward);
    req.pipe(request(urlAward)).pipe(res);
});

//Ferna Proxy API grupo 4
app.use("/proxy-poverty", function(req, res) {
    var apiServer = 'https://endpoint-poverty-risks.herokuapp.com';
    var urlGame = apiServer + req.url;
    console.log('piped: /proxy -> ' + urlGame);
    req.pipe(request(urlGame)).pipe(res);
});

//Ferna Proxy API grupo 27
app.use("/azar-games", function(req, res) {
    var apiServer = 'http://sos2021-27.herokuapp.com';
    var urlGame = apiServer + req.url;
    console.log('piped: /proxy -> ' + urlGame);
    req.pipe(request(urlGame)).pipe(res);
});

app.listen(port, () =>{
	console.log(`Server ready listening on port ${port}`);
});


