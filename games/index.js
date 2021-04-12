//________________Games_____________________
var BASE_API_PATH_GAMES = "/api/v1/games";

var games = [];

module.exports.register = (app) => {
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
}