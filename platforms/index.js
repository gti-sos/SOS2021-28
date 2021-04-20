//Instalar: npm install cool-ascii-faces
//Instalar: npm install express
//Instalar: npm install body-parser
//instalar: npm install nedb


//required modules
var path = require('path');
var Datastore = require("nedb");

//required variables
var BASE_API_PATH = "/api/v1";
var datafile = path.join(__dirname, 'platforms.db');
var db = new Datastore({ filename: datafile, autoload: true });
var platformsData = [];

///
//________________Platforms_____________________
//5.2  GET: CREAR 2 O MÁS RECURSOS


module.exports.register = (app) => {
	

	

app.get(BASE_API_PATH + "/platforms/loadInitialData", (req, res) => {
	platformsData = [
        {
            "country":"Japan",
            "platform":"Nintendo 3DS",
            "year":2016,
            "sold-unit":202885,
            "generation":8
        },
        {
            "country":"U.S",
            "platform":"Nintendo 3DS",
            "year":2015,
            "sold-unit":15000000,
            "generation":8
        },
        {
            "country":"UK",
            "platform":"PlayStation4",
            "year":2016,
            "sold-unit":3000000,
            "generation":8
        },
        {
            "country":"Germany",
            "platform":"PlayStation4",
            "year":2015,
            "sold-unit":2800000,
            "generation":8
        },
		{
            "country":"Spain",
            "platform":"Nintendo 3DS",
            "year":2014,
            "sold-unit":900000,
            "generation":8
        },
		{
            "country":"France",
            "platform":"Nintendo 3DS",
            "year":2015,
            "sold-unit":4000000,
            "generation":8
        },
		{
            "country":"Portugal",
            "platform":"PlayStation4",
            "year":2015,
            "sold-unit":100000,
            "generation":8
        },
		{
            "country":"China",
            "platform":"PlayStation4",
            "year":2015,
            "sold-unit":73112,
            "generation":8
        }
    ];
	db.insert(platformsData);
	console.log(`Initial Data: <${JSON.stringify(platformsData,null,2)}>`);
	res.sendStatus(200);
    //console.log(`Initial data: <${JSON.stringify(platformsData, null, 2)}>`);
    //res.sendStatus(200);
	//res.send(JSON.stringify(platformsData, null, 2));
  });


	app.get(BASE_API_PATH + "/platforms",(req,res)=>{

	var limit = parseInt(req.query.limit);
	var offset = parseInt(req.query.offset);
	var busqueda = {};

	if(req.query.country) busqueda["country"] = req.query.country;
	if(req.query.platform) busqueda["platform"] = req.query.platform;
	if(req.query.year) busqueda["year"] = parseInt(req.query.year);
	if(req.query.sunit) busqueda["sold-unit"] = parseInt(req.query.nunit)
	if(req.query.generation) busqueda["generation"] = parseInt(req.query.generation);
	
	
	

	db.find(busqueda).skip(offset).limit(limit).exec((err,platforms)=>{
		if(err){
			console.error("ERROR accessing DB in GET");
			res.sendStatus(500);
		}else {
			if (platforms.length != 0){
				platforms.forEach((a)=>{delete a._id; }); 
				console.log(busqueda)
				return res.send(JSON.stringify(platforms,null,2));
				return res.sendStatus(200);
			} else {
				console.log(busqueda)
				console.log("No data found");
				return res.sendStatus(404);
			}
			

		}
	});

});
	
	
	
	
	

	app.post(BASE_API_PATH + '/platforms',(req,res)=>{

	var newObject = req.body;
	llaves = Object.keys(req.body).length
	db.find({country : newObject.country},(err, platform)=>{
		if(err){
			console.error("ERROR accessing DB in POST");
			res.sendStatus(500);
		}else{
			if(platform.length == 0){
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


	
	
//6.3 GET: Get a un recurso -> devuelve ese recurso(objeto JSON)
//GET /api/v1/YYYYYY/XXX/ZZZ 
app.get(BASE_API_PATH + "/platforms/:country/:year", (req, res) => {
  var country = req.params.country;
  var year = parseInt(req.params.year);
	db.find({ $and: [{ country: country }, { year: year }] }, { _id: 0 }, function (err, data) {
		if (err) {
			console.error("ERROR de acceso a la DB en el  GET");
            res.sendStatus(500);
        } else {
			if (data.length == 0) {
				console.error("No se encontro el dato");
                res.sendStatus(404);
            } else {
                console.log(`GET platforms by country: <${country}> and year: <${year}>`);
                res.status(200).send(JSON.stringify(data, null, 2));
            }
        }
    });
});




//6.4 DELETE: Delete a un recurso -> borra ese recurso(JSON)
//DELETE /api/v1/YYYYYY/XXX/ZZZ
//DELETE un recurso
app.delete(BASE_API_PATH+ "/platforms/:country/:year", (req,res) => {
	var country = req.params.country;
    var year = parseInt(req.params.year);
	
	db.remove({ $and: [{ country: country }, { year: year }] }, { multi: true }, function (err, dataDel) {
		if (err) {
			console.error("ERROR de acceso en la DB en el GET");
            res.sendStatus(500);
        } else {
			if (dataDel == 0) {
				console.error("No data found");
                res.sendStatus(404);
            } else {
				console.log(`platforms with country: <${country}> and year: <${year}> deleted`);
                res.sendStatus(200);
            }
        }
    });
 
});
	
	



//6.5 PUT: Put a un recurso -> actualiza ese recurso
//PUT a un recurso
//Put modificar elemento
app.put(BASE_API_PATH+"/platforms/:country/:year", function(req, res) { 
	var country = req.params.country;
    var year = parseInt(req.params.year);
	var newPlatfrom = req.body;
	
	db.update({ $and: [{ country: country }, { year: year }] }, { $set: newPlatfrom }, {}, function (err, reemplazo) {
		if (err) {
			console.error("ERROR de acceso en la DB en el  GET");
			res.sendStatus(500);
        } else {
			if (reemplazo == 0) {
				console.error("No se encontraron datos");
                res.sendStatus(404);
            } else {
				console.log("Actualizacion correcta");
                res.sendStatus(200);
            }
        }
    });
        
});


 
//6.6 POST: Post a un recurso -> error de método no permitido
app.post(BASE_API_PATH + "/platforms/:country/:year", (req, res) => {
    console.log("Method not allowed");
    return res.sendStatus(405);
  }); 
  

//6.7 PUT: Put a la lista de recursos -> debe dar un error de método no permitido
app.put(BASE_API_PATH + "/platforms", (req, res) => {
    console.log("Method not allowed");
    return res.sendStatus(405);
 });


//6.8 DELETE: Borra todos los recursos
app.delete(BASE_API_PATH + "/platforms", (req, res) => {
	db.remove({}, { multi: true }, function (err, eliminados) {
		if (err) {
			console.error("ERROR en la DB en el DELETE");
            res.sendStatus(500);
        } else {
			if (eliminados == 0) {
				console.error("ERROR, platforms not found");
                res.sendStatus(404);
            } else {
				res.sendStatus(200);
            }
        }
    });
	/*
    platformsData.length = 0;
    console.log('Resources deleted');
    return res.sendStatus(200);
	*/
  });

}