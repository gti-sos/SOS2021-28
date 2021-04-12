//-----------------------------Recurso /api/v1 - F04-------------------------------
//____________awards_______________
//5.2 Get crear 2 o mas recursos
//F05 API AWARDS CREADA EN UN MODULO

var BASE_API_PATH = "/api/v1";
var awardsData = [];
module.exports.register = (app) => {

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
	console.log(`Initial Data: <${JSON.stringify(awardsData,null,2)}>`);
	res.sendStatus(200);
});

//6.1 GET : devuelve una lista de recursos 

app.get(BASE_API_PATH + "/awards",(req,res)=>{
	if (awardsData.length != 0){
		console.log(`requested awards dataset`);
		return res.send(JSON.stringify(awardsData,null,2));
	} else {
		console.log("No data found");
		return res.sendStatus(404);
	}
	return res.send.sendStatus(200);
	
});

//6.2 POST : Crea un nuevo recurso
app.post(BASE_API_PATH + '/awards',(req,res)=>{

	var newObject = req.body;
	console.log(`Nuevo elemento creado: <${JSON.stringify(newObject,null,2)}>`);
	awardsData.push(newObject);
	res.sendStatus(201);
	
});

//6.3 GET: get a un recurso -> devuelve un recurso json
app.get(BASE_API_PATH + "/awards/:country/:year",(req,res)=>{
	var country = req.params.country;
	var year = parseInt(req.params.year);

	console.log(`GET stat by country: <${country}> and year: <${year}>`);
	for (var stat of awardsData){
		if(stat.country === country && stat.year === year) {
			return res.status(200).json(stat);
		}
	}
	return res.sendStatus(404);
});

//6.4 DELETE : delete un recurso json
app.delete(BASE_API_PATH+ "/awards/:country/:year", (req,res)=>{
	var del_data = req.params;
	for (var i = 0; i <  awardsData.length; i++){
		if(awardsData[i].country === del_data.country && awardsData[i].year === parseInt(del_data.year)){
			platformsData.splice(i,1);
			console.log(`El recurso: <${del_data.country}> <${del_data.year}> ha sido eliminado`);
			return res.sendStatus(200);
		}
	}
	return res.sendStatus(404);
});

//6.5 PUT: put un recurso (atualiza)
app.put(BASE_API_PATH + "/awards/:country/:year", function(req,res){
	for(var i in awardsData){
		if(awardsData[i].country == String(req.params.country) && awardsData[i].year == String(req.params.year)){
			var newData = req.body;
			awardsData[i] = newData;
			break;
		}
	}
	awardsData = awardsData.map(i => JSON.stringify(i));
	awardsData = new Set(awardsData);
	awardsData = [...awardsData]
	awardsData = awardsData.map(i => JSON.parse(i))
	res.status(200).send("Modificacion correcta");
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
	awardsData.length = 0 ;
	console.log('Resources deleted');
	return res.sendStatus(200);
});
}