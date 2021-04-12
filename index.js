//MODULOS
var express = require("express");
var cool = require("cool-ascii-faces");
var path = require("path");
var bodyParser = require('body-parser');
const { Console } = require("console");

//VARIABLES PARA LOS SERVIDORES
var app = express();
var BASE_API_PATH = "/api/v1";
var port = process.env.PORT || 10000;

//USOS DEL SERVIDOR
app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(express.json());


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

var apiAwards = require("./awards");
apiAwards.register(app);


var apiPlatforms =  require("./platforms");
apiPlatforms.register(app);


//________________Games_____________________
var BASE_API_PATH_GAMES = "/api/v1/games";

var games = [];

app.get(BASE_API_PATH_GAMES, (req, res)=>{
	res.send(JSON.stringify(games, null, 2));
});

app.get(BASE_API_PATH_GAMES + "/loadInitialData", (req, res)=>{
	
	games = [
		{
			"country" : "Japan",
			"game" : "Super Mario Bros.",
			"year" : 1985,
			"sold-unit" : 40240000,
			"company" : "Nintendo"
		},
		{
			"country" : "Japan",
			"game" : "Pokemon Gold/Silver/Crystal",
			"year" : 1999,
			"sold-unit" : 31380000,
			"company" : "Nintendo"
		},
		{
			"country" : "EEUU",
			"game" : "Call of Duty Modern Warfare 3",
			"year" : 2011,
			"sold-unit" : 26500000,
			"company" : "Activision"
		},
		{
			"country" : "EEUU",
			"game" : "Grand Theft Auto San Andreas",
			"year" : 2004,
			"sold-unit" : 27500000,
			"company" : "Rockstar Games"
		},
		{
			"country" : "EEUU",
			"game" : "The Sims 2",
			"year" : 2004,
			"sold-unit" : 20000000,
			"company" : "Electronic Arts"
		},
		{
			"country" : "Sweden",
			"game" : "Minecraft",
			"year" : 2011,
			"sold-unit" : 200000000,
			"company" : "Mojang"
		},
		{
			"country" : "EEUU",
			"game" : "FIFA 18",
			"year" : 2017,
			"sold-unit" : 24000000,
			"company" : "EA Sports"
		},
		{
			"country" : "EEUU",
			"game" : "Terraria",
			"year" : 2011,
			"sold-unit" : 20000000,
			"company" : "505 Games"
		}
	];
	
	res.send(JSON.stringify(games, null, 2));
});
app.post(BASE_API_PATH_GAMES, (req, res)=>{
	var newGame = req.body;
	console.log(`new game to be added: <${JSON.stringify(newGame, null, 2)}>`);
	games.push(newGame);
	res.sendStatus(201);
});

app.get(BASE_API_PATH_GAMES + "/:country/:year", (req, res) => {
  var country = req.params.country;
  var year = parseInt(req.params.year);
  for (var stat of games) {
    if (stat.country === country && stat.year === year) {
      return res.status(200).json(stat);
    }
  }
  return res.sendStatus(404);
});

app.delete(BASE_API_PATH_GAMES + "/:country/:year", (req,res) => {
  var delGame = req.params;
  for(var i=0; i < games.length; i++){
    if(games[i].country=== delGame.country && games[i].year === parseInt(delGame.year)){
      games.splice(i, 1);
      return res.sendStatus(200);
    }
  }
  return res.sendStatus(404);
});


app.put(BASE_API_PATH_GAMES + "/:country/:year", function(req, res) { 
	for(var e in games){
		if(games[e].country == String(req.params.country) && games[e].year == String(req.params.year)){
			var newData = req.body;
			games[e] = newData;
			break;
		}
	}
	games = games.map(e => JSON.stringify(e));
	games = new Set(games);
	games = [...games] //Añadir ; ?
	games = games.map(e => JSON.parse(e)) //Añadir ; ?
	res.status(200).send("Modificacion correcta");
});

app.post(BASE_API_PATH_GAMES + "/:country/:year", (req, res) => {
    return res.sendStatus(405);
  }); 
  

app.put(BASE_API_PATH_GAMES, (req, res) => {
    return res.sendStatus(405);
 });


app.delete(BASE_API_PATH_GAMES, (req, res) => {
    games.length = 0;
    return res.sendStatus(200);
  });


//Pruebas
app.post("/hello", (req, res) => {
	res.send("<html><body><h1>POST Hello from this tiny server</h1></body></html>");
});

app.listen(port, () =>{
	console.log(`Server ready listening on port ${port}`);
});


