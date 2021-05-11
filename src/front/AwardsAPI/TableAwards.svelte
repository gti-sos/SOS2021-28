<script>
 

    import {
        onMount
    } from "svelte";

    import {
    Button,
    Table,
    Pagination,
    PaginationItem,
    PaginationLink,
  } from "sveltestrap";

    let awards = [];
    let newAward = {
        "country": "",
        "year": 0,
        "gala": 0,
        "winner": "",
        "n-platform":0,
        "n-award":0
        

    }

    let busqueda = {
        "country": "",
        "year": "",
        "gala": "",
        "winner": "",
        "nplatform":"",
        "naward":""
        

    }


    let fullQuery = "";

    //Pagination
    let current_offset = 0;
    let limit = 10;

    let current_page = 1;
    let last_page = 1;
    let total = 0;

    const BASE = "/api/v1";
    let errorMsg = "";
    let okMsg = "";
    let errorStatus = 0;

    
    async function getAwards(){
        console.log("Fetching awards ...");
        const res = await fetch(
      BASE +
        "/awards?limit=" +
        limit +
        "&offset=" +
        current_offset
    );

    if (res.ok) {
      console.log("Ok");
      const json = await res.json();
      awards = json;
      console.log(`We have received ${awards.length} __.`);
      errorMsg = "";
      getNumTotal();
    } else {
      if (awards.length === 0) {
        errorMsg = "No hay datos disponibles";
        console.log("ERROR!");
      }
      if (res.status === 500) {
        errorMsg = "No se han podido acceder a la base de datos";
      }else if(res.status ===404){
          errorMsg = "No se han encontrado datos";
        }
      okMsg = "";
      console.log("ERROR!" + errorMsg);
    }
  }

    async function getLoadAwards(){
        console.log("Fetching awards ...");
        const res = await fetch(BASE +"/awards/LoadInitialData").then( (res) => {
                               
                           
            if(res.ok){
                console.log("Ok.");
                getAwards();
                errorMsg = ""
                errorStatus = 0
                okMsg = "Datos cargados correctamente"
                
            }else{
                if(res.status === 500) {
                    errorMsg = "No se han podido acceder a la base de datos";
                }
                okMsg = "";
                console.log("ERROR!" + errorMsg);
            }
        })
    }

    async function insertAwards(){
        console.log("Inserting award "+ JSON.stringify(newAward));
        if (newAward.country === "" || newAward.year === 0){
            errorMsg = "debe introducir pais y año";
            okMsg = "";
            console.log("ERROR!" + errorMsg);
        }else{

        const res = await fetch(BASE +"/awards",
                            {
                                method: "POST",
                                body: JSON.stringify(newAward),
                                headers:{
                                    "Content-Type": "application/json"
                                }
                            }
                           ).then( (res) => {
                               
                               if(res.ok){
                                    console.log("Ok.");
                                    getAwards();
                                    errorMsg = ""
                                    errorStatus = 0
                                    okMsg = "Dato cargado correctamente"
                                    
                                }else{
                                    if(res.status === 500) {
                                        errorMsg = "No se han podido acceder a la base de datos";
                                    }else if(res.status ===409){
                                            errorMsg = "ya existe el recurso dado";
                                        }else if(res.status ===400){
                                            errorMsg = "se han introducido datos erroneos";
                                        }
                                    okMsg = "";
                                    console.log("ERROR!" + errorMsg);
            }
        })
        }
    }
                
    
    
    async function deleteAwards(AwardCountry,AwardYear){
        console.log("Deleting contact with name "+ AwardCountry + "/" + AwardYear);

        const res = await fetch(BASE +"/awards/" + AwardCountry + "/" + AwardYear,
                            {
                                method: "DELETE"
                            }
                           ).then(function (res) {
      if (res.ok) {
        console.log("OK");
        
        if (awards.length === 1) {
          awards = [];
          currentPage = 1;
          
        }
        errorMsg = "";
        okMsg = "Operación realizada correctamente";
        getAwards();
      } else {
        if(res.status===404){
          errorMsg = "No existe el dato a borrar";
        }else if(res.status ===500){
          errorMsg = "No se han podido acceder a la base de datos";
        }        
        okMsg = "";
        console.log("ERROR!" + errorMsg);
      }
    });
  }

    async function deleteAllAwards(){
        console.log("Deleting awards");

        const res = await fetch(BASE +"/awards/",
                            {
                                method: "DELETE"
                            }
                           ).then(function (res) {
                               
          
                            
      if (res.ok) {
        console.log("OK");
        awards = []
        errorMsg = "";
        okMsg = "Operación realizada correctamente";
        
        
      } else {
        if(res.status===404){
            
          errorMsg = "No existen datos que borrar";
          
        }else if(res.status ===500){
          errorMsg = "No se han podido acceder a la base de datos";
        }        
        okMsg = "";
        console.log("ERROR!" + errorMsg);
      }
    });
  }

  async function searchAward() {
    console.log("Searching award...");
    
    var campos = new Map(
      Object.entries(busqueda)
    );
    let querySymbol = "?";
    for (var [clave, valor] of campos.entries()) {
      if(valor != "" && valor != null){  
      querySymbol += clave + "=" + valor + "&";
      }
    }
    fullQuery = querySymbol.slice(0, -1);
    console.log("la query es " + fullQuery)
    if (fullQuery != "") {
      const res = await fetch(
        BASE + "/awards/" + fullQuery
      );
      if (res.ok) {
        console.log("OK");
        const json = await res.json();
        awards = json;
        errorMsg = ""
        okMsg="Búsqueda realizada correctamente"
      } else {
        if (res.status === 404) {
          errorMsg = "No se encuentra el dato solicitado";
        } else if (res.status === 500) {
          errorMsg = "No se han podido acceder a la base de datos";
        }
        okMsg = "";
        console.log("ERROR!" + errorMsg);

      }
      
    }else {
      errorMsg = "No se encuentra el dato solicitado";
      okMsg = "";
      console.log("ERROR!" + errorMsg);
      getAwards();
      
    }  
      
      
    }
  

  //Total de datos en la BD
  async function getNumTotal() {
    const res = await fetch(BASE + "/awards");
    if (res.ok) {
      const json = await res.json();
      total = json.length;
      console.log("getTOTAL: " + total);
      changePage(current_page, current_offset);
    } else {
      errorMsg = "No se han encontrado datos.";
    }
  }
  //Calcula el rango entre ods valores
  function range(size, startAt = 0) {
    return [...Array(size).keys()].map((i) => i + startAt);
  }

  //Cambio de pagina
  function changePage(page, offset) {
    console.log("------Change page------");
    console.log("Params page: " + page + " offset: " + offset);
    last_page = Math.ceil(total / 10);
    console.log("new last page: " + last_page);
    if (page !== current_page) {
      console.log("enter if");
      current_offset = offset;
      current_page = page;
      console.log("page: " + page);
      console.log("current_offset: " + current_offset);
      console.log("current_page: " + current_page);
      getAwards();
    }
    console.log("---------Exit change page-------");
  }


    onMount(getAwards);

</script>

<main>
    <h1>Tabla relacionada con los premios a videojuegos</h1>
    {#if errorMsg}
    <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    {#if okMsg}
    <p style="color: green">{okMsg}</p>
    {/if}
    <Table bordered>
        <thead>
            <tr>
                <td>pais</td>
                <td>año</td>
                <td>gala</td>
                <td>ganador</td>
                <td>numero de plataformas</td>
                <td>numero de premios ganados</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input bind:value={newAward.country}></td>
                <td><input type=number bind:value={newAward.year}></td>
                <td><input type=number bind:value={newAward.gala}></td>
                <td><input bind:value={newAward.winner}></td>
                <td><input type=number bind:value={newAward["n-platform"]}></td>
                <td><input type=number bind:value={newAward["n-award"]}></td>
                <td><Button on:click={insertAwards}>insertar</Button></td>
                
            </tr>

            <tr>
                <td><input bind:value={busqueda.country}></td>
                <td><input type=number bind:value={busqueda.year}></td>
                <td><input type=number bind:value={busqueda.gala}></td>
                <td><input bind:value={busqueda.winner}></td>
                <td><input type=number bind:value={busqueda.nplatform}></td>
                <td><input type=number bind:value={busqueda.naward}></td>
                
                <td><Button color="secondary" on:click={searchAward}>Buscar</Button></td>
            </tr>
            
            {#each awards as data}
                <tr>
                    <td><a href="#/awards/{data.country}/{data.year}">{data.country}</a></td>
                    <td>{data.year}</td>
                    <td>{data.gala}</td>
                    <td>{data.winner}</td>
                    <td>{data["n-platform"]}</td>
                    <td>{data["n-award"]}</td>
                    <td><Button on:click={deleteAwards(data.country,data.year)}>Borrar</Button></td>
                    
                </tr>
            
            {/each}
            
                   
            
                
        </tbody>
    </Table>
    <tr>
        <td> <Button on:click={deleteAllAwards}>Borrar Todo</Button> </td>
        <td> <Button on:click={getLoadAwards}>Cargar Valores Iniciales</Button> </td>
    </tr> 

    <!-- Pagination -->
  <Pagination ariaLabel="Web pagination">
    <PaginationItem class={current_page === 1 ? "disabled" : ""}>
      <PaginationLink
        previous
        href="#/awards"
        on:click={() => changePage(current_page - 1, current_offset - 10)}
      />
    </PaginationItem>
    {#each range(last_page, 1) as page}
      <PaginationItem class={current_page === page ? "active" : ""}>
        <PaginationLink
          previous
          href="#/awards"
          on:click={() => changePage(page, (page - 1) * 10)}
          >{page}</PaginationLink
        >
      </PaginationItem>
    {/each}
    <PaginationItem class={current_page === last_page ? "disabled" : ""}>
      <PaginationLink
        next
        href="#/awards"
        on:click={() => changePage(current_page + 1, current_offset + 10)}
      />
    </PaginationItem>
  </Pagination>
</main>

<style>
    main {
      text-align: center;
      padding: 1em;
      max-width: 240px;
      margin: 0 auto;
    }
    h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 3em;
      font-weight: 100;
    }
    b {
      color: #00c1ff;
    }
    @media (min-width: 640px) {
      main {
        max-width: none;
      }
    }
  </style>