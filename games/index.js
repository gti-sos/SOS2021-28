//________________Games_____________________
var path = require('path');
var Datastore = require("nedb");
var BASE_API_PATH_GAMES = "/api/v1/games";
var datafile = path.join(__dirname, 'games.db');
var db = new Datastore({ filename: datafile, autoload: true });
var games = [];

module.exports.register = (app) => {


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
	db.insert(games);
	res.send(JSON.stringify(games, null, 2));
});

app.get(BASE_API_PATH_GAMES, (req, res) => {
	var limit = parseInt(req.query.limit);
	var offset = parseInt(req.query.offset);
	var busqueda = {};
	
	if(req.query.country) busqueda["country"] = req.query.country;
	if(req.query.game) busqueda["game"] = req.query.game;
	if(req.query.year) busqueda["year"] = parseInt(req.query.year);
	if(req.query.sunit) busqueda["sold-unit"] = parseInt(req.query.nunit)
	if(req.query.company) busqueda["company"] = req.query.company
	
  db.find(busqueda).skip(offset).limit(limit).exec((err,games)=>{
		if(err){
			console.error("ERROR accessing DB in GET");
			res.sendStatus(500);
		}else {
			if (games.length != 0){
				games.forEach((a)=>{delete a._id; }); 
				console.log(busqueda)
				return res.send(JSON.stringify(games,null,2));
				return res.sendStatus(200);
			} else {
				console.log(busqueda)
				console.log("No data found");
				return res.sendStatus(404);
			}
		}
	});
});


app.post(BASE_API_PATH_GAMES,(req,res)=>{

	var newObject = req.body;
	llaves = Object.keys(req.body).length
	db.find({game : newObject.game},(err, games)=>{
		if(err){
			console.error("ERROR accessing DB in POST");
			res.sendStatus(500);
		}else{
			if(games.length == 0){
				if(llaves == 5){
					console.log(`Nuevo elemento creado: <${JSON.stringify(newObject,null,2)}>`);
					db.insert(newObject);
					res.sendStatus(201);

				}else{
					console.log('mal uso de las llaves, ERROR');
					res.sendStatus(400);
				}
				
			}else{
				res.sendStatus(409);
			}
		}
	});	
});

	/*
	//6.2 POST : Crea un nuevo recurso
app.post(BASE_API_PATH_GAMES,(req,res)=>{

	var newObject = req.body;
	llaves = Object.keys(req.body).length
	db.find({country : newObject.country},(err, games)=>{
		if(err){
			console.error("ERROR accessing DB in POST");
			res.sendStatus(500);
		}else{
			if(games.length == 0){
				if(llaves == 5){
					console.log(`Nuevo elemento creado: <${JSON.stringify(newObject,null,2)}>`);
					db.insert(newObject);
					res.sendStatus(201);

				}else{
					console.log('mal uso de las llaves, ERROR');
					res.sendStatus(400);
				}
				
			}else{
				res.sendStatus(409);
			}
		}
	});	
});
*/

app.get(BASE_API_PATH_GAMES + "/:country/:year", (req, res) => {
	var country = req.params.country;
	var year = parseInt(req.params.year);
	
	//for (var stat of games) {
    	//if (stat.country === country && stat.year === year) {
    		//return res.status(200).json(stat);
		//}
	//}
	//return res.sendStatus(404);
	
	db.find({country : country, year : year},(err, games)=>{
		if(err){
			res.sendStatus(500);
		}else{
			if(games.length != 0){
				games.forEach((f)=>{
					delete f._id; 
				}); 
				return res.send(JSON.stringify(games,null,2));
				return res.sendStatus(200);
			}else{
				return res.sendStatus(404);
			}
			

		}
	});
});
	/*
app.get(BASE_API_PATH_GAMES, (req, res)=>{
	res.send(JSON.stringify(games, null, 2));
});
*/
app.delete(BASE_API_PATH_GAMES + "/:country/:year", (req,res) => {
	var delGame = req.params;
	
	//for(var i=0; i < games.length; i++){
    	//if(games[i].country=== delGame.country && games[i].year === parseInt(delGame.year)){
    		//games.splice(i, 1);
    		//return res.sendStatus(200);
    	//}
	//}
	//return res.sendStatus(404);
	
	db.remove({country : delGame.country, year : parseInt(delGame.year)},{},(err,numGames)=>{
		if(err){
			res.sendStatus(500);
		}else{
			if(numGames==0){
				return res.sendStatus(404);
			}else{
				return res.sendStatus(200);
			}

		}
	});
});


app.put(BASE_API_PATH_GAMES + "/:country/:year", function(req, res) { 
	
	//for(var e in games){
		//if(games[e].country == String(req.params.country) && games[e].year == String(req.params.year)){
			//var newData = req.body;
			//games[e] = newData;
			//break;
		//}
	//}
	//games = games.map(e => JSON.stringify(e));
	//games = new Set(games);
	//games = [...games] //Añadir ; ?
	//games = games.map(e => JSON.parse(e)) //Añadir ; ?
	//res.status(200).send("Modificacion correcta");
	
	var country = req.params.country;
    var year = parseInt(req.params.year);
	var updateGame = req.body;
	
	db.update({$and : [{country : country}, {year : year}]}, {$set : updateGame}, {}, function (err, replaceGame){
		if(err){
			res.sendStatus(500);
        }else{
			if(replaceGame == 0) {
                res.sendStatus(404);
            }else{
                res.sendStatus(200);
            }
        }
    });
});

app.post(BASE_API_PATH_GAMES + "/:country/:year", (req, res) => {
    return res.sendStatus(405);
  }); 
  

app.put(BASE_API_PATH_GAMES, (req, res) => {
    return res.sendStatus(405);
 });


app.delete(BASE_API_PATH_GAMES, (req, res) => {
    
	//games.length = 0;
    //return res.sendStatus(200);
	
	db.remove({}, {multi : true}, function (err, eliminarGames){
		if(err) {
            res.sendStatus(500);
        }else{
			if(eliminarGames == 0) {
                res.sendStatus(404);
            }else{
				res.sendStatus(200);
            }
        }
    });
  });
}