//-----------------------------Recurso /api/v1 - F04-------------------------------
//____________awards_______________
//5.2 Get crear 2 o mas recursos
//F05 API AWARDS CREADA EN UN MODULO

var BASE_API_PATH = "/api/v1";
var awardsData = [];



module.exports.register = (app,db) => {

app.get(BASE_API_PATH + "/awards/loadInitialData",(req,res)=>{
	awardsData = [
	{
		"country":"Francia",
		"year":2014,
		"gala":2014,
		"winner":"Valiant Hearts: The Great War",
		"n-platform":7,
		"n-award":2
	
	},
	{
		"country":"Canadá",
		"year":2014,
		"gala":2014,
		"winner":"Dragon Age: Inquisition",
		"n-platform":5,
		"n-award":2
	},
	{
		"country":"USA",
		"year":2014,
		"gala":2014,
		"winner":"Shovel Knight",
		"n-platform":3,
		"n-award":1
		
	},
	{
		"country":"USA",
		"year":2014,
		"gala":2014,
		"winner":"Hearthstone: Heroes of Warcraft",
		"n-platform":3,
		"n-award":1
	},
	{
		"country":"Canadá",
		"year":2014,
		"gala":2014,
		"winner":"Child of Light",
		"n-platform":7,
		"n-award":1
	},
	{
		"country":"Reino Unido",
		"year":2014,
		"gala":2014,
		"winner":"Alien: Isolation",
		"n-platform":6,
		"n-award":1
	},
	{
		"country":"USA",
		"year":2014,
		"gala":2014,
		"winner":"Destiny",
		"n-platform":4,
		"n-award":2
	},
	{
		"country":"USA",
		"year":2013,
		"gala":2014,
		"winner":"Grand Theft Auto V",
		"n-platform":4,
		"n-award":1

	}
	];
	db.insert(awardsData);
	console.log(`Initial Data: <${JSON.stringify(awardsData,null,2)}>`);
	res.sendStatus(200);
});

//6.1 GET : devuelve una lista de recursos 

/*app.get(BASE_API_PATH + "/awards",(req,res)=>{
	db.find({},(err, awards)=>{
		if(err){
			console.error("ERROR accessing DB in GET");
			res.sendStatus(500);
		}else {
			if (awards.length != 0){
				awards.forEach((a)=>{delete a._id; }); 
				
				return res.send(JSON.stringify(awards,null,2));
				return res.sendStatus(200);
			} else {
				console.log("No data found");
				return res.sendStatus(404);
			}
			

		}
	});
		
});
*/
app.get(BASE_API_PATH + "/awards",(req,res)=>{

	var limit = parseInt(req.query.limit);
	var offset = parseInt(req.query.offset);
	var busqueda = {};

	if(req.query.country) busqueda["country"] = req.query.country;
	if(req.query.year) busqueda["year"] = parseInt(req.query.year);
	if(req.query.gala) busqueda["gala"] = parseInt(req.query.gala);
	if(req.query.winner) busqueda["winner"] = req.query.winner
	if(req.query.nplatform) busqueda["n-platform"] = parseInt(req.query.nplatform)
	if(req.query.naward) busqueda["n-award"] = parseInt(req.query.naward)

	db.find(busqueda).skip(offset).limit(limit).exec((err,awards)=>{
		if(err){
			console.error("ERROR accessing DB in GET");
			res.sendStatus(500);
		}else {
			if (awards.length != 0){
				awards.forEach((a)=>{delete a._id; }); 
				console.log(busqueda)
				return res.send(JSON.stringify(awards,null,2));
				return res.sendStatus(200);
			} else {
				console.log(busqueda)
				console.log("No data found");
				return res.sendStatus(404);
			}
			

		}
	});

});
//6.2 POST : Crea un nuevo recurso
app.post(BASE_API_PATH + '/awards',(req,res)=>{

	var newObject = req.body;
	llaves = Object.keys(req.body).length
	db.find({country : newObject.country},(err, awards)=>{
		if(err){
			console.error("ERROR accessing DB in POST");
			res.sendStatus(500);
		}else{
			if(awards.length == 0){
				if(llaves == 6){
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
	
	//awardsData.push(newObject);
	
});

//6.3 GET: get a un recurso -> devuelve un recurso json
app.get(BASE_API_PATH + "/awards/:country/:year",(req,res)=>{
	var sc = req.params.country;
	var sy = parseInt(req.params.year);

	console.log(`GET stat by country: <${sc}> and year: <${sy}>`);
	db.find({country : sc, year : sy},(err, awards)=>{
		if(err){
			console.error("ERROR accessing DB in GET");
			res.sendStatus(500);
		}else {
			if (awards.length != 0){
				awards.forEach((a)=>{delete a._id; 
				}); 
				console.log(`requested awards dataset`);
				return res.send(JSON.stringify(awards[0],null,2));
				return res.sendStatus(200);
			} else {
				console.log("No data found");
				return res.sendStatus(404);
			}
			

		}
	});
	});
	

//6.4 DELETE : delete un recurso json
app.delete(BASE_API_PATH+ "/awards/:country/:year", (req,res)=>{
	var del_data = req.params;
	db.remove({country : del_data.country, year : parseInt(del_data.year)},{},(err,numAwards)=>{
		if(err){
			console.error("ERROR removing DB in REMOVE");
			res.sendStatus(500);
		}else{
			if(numAwards==0){
				return res.sendStatus(404);
			}else{
				return res.sendStatus(200);
			}

		}
	});
});

//6.5 PUT: put un recurso (atualiza)
app.put(BASE_API_PATH + "/awards/:country/:year", function(req,res){
	var sc = req.params.country;
	var sy = parseInt(req.params.year);
	llaves = Object.keys(req.body).length 
	db.find({country : sc, year : sy},(err, awards)=>{
		if(err){
			console.error("ERROR accessing DB in GET");
			res.sendStatus(500);
		}else {
			if (sc == req.body.country && sy == req.body.year){
				if(llaves == 6){
					db.remove({country : sc, year : sy},{multi:true},function (err,numAwards){});
					db.insert(req.body);
					console.log(`requested updated award dataset`);
					res.sendStatus(200);

				}else{
					console.log("mal uso de las llaves");
					res.sendStatus(400);

				}
				
				
			} else{
					res.sendStatus(409);
					
			}
			

		}
	});
});

//6.6 post a un recurso (da error)
app.post(BASE_API_PATH +"/awards/:country/:year", (req,res) =>{
	console.log("Method not allowed");
	return res.sendStatus(405);
});

//6.7 put a la lista de recursos (error)
app.put(BASE_API_PATH + "/awards", (req,res) =>{
	console.log("Method not allowed");
	return res.sendStatus(405);
});

//6.8 DELETE: borra todo los recursos
app.delete(BASE_API_PATH + "/awards", (req,res)=>{
	db.remove({},{multi:true},(err,numAwards)=>{
		if(err){
			console.error("ERROR removing DB in REMOVE");
			res.sendStatus(500);
		}else{
			if(numAwards==0){
				return res.sendStatus(404);
			}else{
				return res.sendStatus(200);
			}

		}
	});
	
});



}