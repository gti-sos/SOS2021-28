//________________Platforms_____________________
//5.2  GET: CREAR 2 O MÁS RECURSOS

var platformsData = [];var BASE_API_PATH = "/api/v1";
var awardsData = [];
module.exports.register = (app) => {
	

//6.1 GET: Devuelve la lista de recursos (array JSON)
//GET /api/v1/YYYYYY 
app.get(BASE_API_PATH + '/platforms', (req, res)=>{
	res.send(JSON.stringify(platformsData, null, 2));
});

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
    //console.log(`Initial data: <${JSON.stringify(platformsData, null, 2)}>`);
    //res.sendStatus(200);
	res.send(JSON.stringify(platformsData, null, 2));
  });



//POST /api/v1/YYYYYY 
//crea un nuevo recurso.
app.post(BASE_API_PATH + '/platforms', (req, res)=>{
	var newPlatfrom = req.body;
	console.log(`New platform to be added: <${JSON.stringify(newPlatfrom, null, 2)}>`);
	platformsData.push(newPlatfrom);
	res.sendStatus(201);
});


//6.3 GET: Get a un recurso -> devuelve ese recurso(objeto JSON)
//GET /api/v1/YYYYYY/XXX/ZZZ 
app.get(BASE_API_PATH + "/platforms/:country/:year", (req, res) => {
  var country = req.params.country;
  var year = parseInt(req.params.year);

  console.log(`GET stat by country: <${country}> and year: <${year}>`);
  for (var stat of platformsData) {
    if (stat.country === country && stat.year === year) {
      return res.status(200).json(stat);
    }
  }

  return res.sendStatus(404);
});




//6.4 DELETE: Delete a un recurso -> borra ese recurso(JSON)
//DELETE /api/v1/YYYYYY/XXX/ZZZ
//DELETE un recurso
app.delete(BASE_API_PATH+ "/platforms/:country/:year", (req,res) => {
  var del_data = req.params;
  for(var i=0; i < platformsData.length; i++){
    if(platformsData[i].country=== del_data.country && platformsData[i].year === parseInt(del_data.year)){
      platformsData.splice(i, 1); /*al metodo splice le pasamos el índice del objeto a partir del cual vamos a borrar objetos del array y el número de objetos a eliminar*/
      console.log(`El recurso: <${del_data.country}>  <${del_data.year}> ha sido eliminado`);
      return res.sendStatus(200);
    }
  }
  return res.sendStatus(404);
});


//6.5 PUT: Put a un recurso -> actualiza ese recurso
//PUT a un recurso
//Put modificar elemento
app.put(BASE_API_PATH+"/platforms/:country/:year", function(req, res) { 
	//Recorremos el array en busca del elemento a modificar
	for(var e in platformsData){
		if(platformsData[e].country == String(req.params.country) && platformsData[e].year == String(req.params.year)){
			var newData = req.body;
			platformsData[e] = newData;
			break;
		}
	}
	//Eliminamos repetidos en caso de que se haya realizado un cambio para añadirlo
	platformsData = platformsData.map(e => JSON.stringify(e)); //Lo pasamos a JSON para poder compararlos
	platformsData = new Set(platformsData); //Lo convertimos a conjunto para eliminar repetidos
	platformsData = [...platformsData] //Lo convertimos de nuevo a array
	platformsData = platformsData.map(e => JSON.parse(e)) //Lo pasamos de nuevo a objetos
	res.status(200).send("Modificacion correcta");
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
    platformsData.length = 0;
    console.log('Resources deleted');
    return res.sendStatus(200);
  });

}