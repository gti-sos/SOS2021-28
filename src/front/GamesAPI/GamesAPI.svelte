<script>
    import {
      Nav,
      Modal,
      ModalBody,
      ModalFooter,
      ModalHeader,
      NavItem,
      NavLink,
      Button,
      Table,
      Pagination,
      PaginationItem,
      PaginationLink,
    } from "sveltestrap";
    import { onMount } from "svelte";
  
    //------------------Nav-----------------------
  
    //Load stats
    let open1 = false;
    const toggle1 = () => (open1 = !open1);
    const toggle1P = () => {
      open1 = !open1;
      loadStats();
    };
    //Delete all stats
    let open2 = false;
    const toggle2 = () => (open2 = !open2);
    const toggle2P = () => {
      open2 = !open2;
      deleteAllStats();
    };
  
    //------------------API-------------------
    const BASE_CONTACT_API_PATH = "/api/v1";
  
    let gamesStats = [];
  
    let newStat = {
      "country": "",
      "game": "",
      "year": 0,
      "sold-unit": 0,
      "company": ""
    };
  
    //Alertas
    let errorMsg = "";
    let okMsg = "";
    let errorStatus = 0;
  
    let fullQuery = "";
  
    //Pagination
    let current_offset = 0;
    let limit = 10;
  
    let current_page = 1;
    let last_page = 1;
    let total = 0;
  
    //Functions
  
    async function loadStats() {
      console.log("Loading data...");
      const res = await fetch(
        BASE_CONTACT_API_PATH + "/games/loadInitialData"
      ).then(function (res) {
        if (res.ok) {
          console.log("OK");
          getStats();
          errorMsg = "";
          errorStatus = 0;
          okMsg = "Datos cargados correctamente";
        } else {
          if (res.status === 409) {
            errorMsg = "Alguno de los datos ya se encuentra cargado";
          } else if (res.status === 500) {
            errorMsg = "No se han podido acceder a la base de datos";
          }
          okMsg = "";
          console.log("ERROR!" + errorMsg);
        }
      });
    }
  
    async function searchStat() {
      console.log("Searching stat...");
  
      var campos = new Map(
        Object.entries(newStat).filter((o) => {
          return o[1] != "";
        })
      );
      let querySymbol = "?";
      for (var [clave, valor] of campos.entries()) {
        querySymbol += clave + "=" + valor + "&";
      }
      fullQuery = querySymbol.slice(0, -1);
  
      if (fullQuery != "") {
        const res = await fetch(
          BASE_CONTACT_API_PATH + "/games/" + fullQuery
        );
        if (res.ok) {
          console.log("OK");
          const json = await res.json();
          gamesStats = json;
          okMsg="Búsqueda realizada correctamente"
        } else {
            gamesStats = [];
          if (res.status === 404) {
            errorMsg = "No se encuentra el dato solicitado";
          } else if (res.status === 500) {
            errorMsg = "No se han podido acceder a la base de datos";
          }
          okMsg = "";
          console.log("ERROR!" + errorMsg);
        }
      } else {
        errorMsg = "";
        okMsg = "Búsqueda realizada correctamente";
        getStats();
      }
    }
  
    //Total de datos en la BD
    async function getNumTotal() {
      const res = await fetch(BASE_CONTACT_API_PATH + "/games");
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
        getStats();
      }
      console.log("---------Exit change page-------");
    }
  
    async function getStats() {
      console.log("Fetching data...");
  
      const res = await fetch(
        BASE_CONTACT_API_PATH +
          "/games?limit=" +
          limit +
          "&offset=" +
          current_offset
      );
  
      if (res.ok) {
        console.log("Ok");
        const json = await res.json();
        gamesStats = json;
        console.log(`We have received ${gamesStats.length} __.`);
        errorMsg = "";
        getNumTotal();
      } else {
        if (gamesStats.length != 0) {
          errorMsg = "No hay datos disponibles";
          console.log("ERROR!");
        }
        if (res.status === 500) {
          errorMsg = "No se han podido acceder a la base de datos";
        }
        okMsg = "";
        console.log("ERROR!" + errorMsg);
      }
    }
  
    async function deleteAllStats() {
      console.log("Deleting games...");
  
      const res = await fetch(BASE_CONTACT_API_PATH + "/games/", {
        method: "DELETE",
      }).then(function (res) {
        if (res.ok) {
          console.log("OK");
          gamesStats = [];
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
  
    async function deleteStat(country, year) {
      console.log(`Deleting data with name ${country} and year ${year}`);
  
      const res = await fetch(
        BASE_CONTACT_API_PATH + "/games/" + country + "/" + year,
        {
          method: "DELETE",
        }
      ).then(function (res) {
        if (res.ok) {
          console.log("OK");
          if (gamesStats.length === 1) {
            gamesStats = [];
            currentPage = 1;
          }
          errorMsg = "";
          okMsg = "Operación realizada correctamente";
          getStats();
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
  
    
    
      
       async function insertStat(){
          console.log("Inserting game "+ JSON.stringify(newStat));
  
          const res = await fetch(BASE_CONTACT_API_PATH +"/games",
                              {
                                  method: "POST",
                                  body: JSON.stringify(newStat),
                                  headers:{
                                      "Content-Type": "application/json"
                                  }
                              }
                             ).then( (res) => {
                                //getStats();
                                if(res.ok){
                                    console.log("Ok.");
                                    getStats();
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
    
  
    onMount(getStats);
    getNumTotal();
  </script>
  
  <main>
    <Nav>
      <NavItem>
        <NavLink href="/">Volver</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#" on:click={toggle1}>Cargar datos inciales</NavLink>
        <Modal isOpen={open1} {toggle1}>
          <ModalHeader {toggle1}>¿Cargar los datos iniciales?</ModalHeader>
          <ModalBody>
            Esta acción cargará los datos siempre y cuando no existan previamente.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" on:click={toggle1P}>Cargar</Button>
            <Button color="secondary" on:click={toggle1}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </NavItem>
      <NavItem>
        {#if gamesStats.length === 0}
          <NavLink disabled href="#" on:click={toggle2}
            >Borrar todos los datos</NavLink
          >
        {:else}
          <NavLink href="#" on:click={toggle2}>Borrar todos los datos</NavLink>
          <Modal isOpen={open2} {toggle2}>
            <ModalHeader {toggle2}>¿Borrar todos los datos?</ModalHeader>
            <ModalBody>Esta acción no se puede deshacer.</ModalBody>
            <ModalFooter>
              <Button color="danger" on:click={toggle2P}>Borrar</Button>
              <Button color="secondary" on:click={toggle2}>Cancelar</Button>
            </ModalFooter>
          </Modal>
        {/if}
      </NavItem>
    </Nav>
    <h2>Juegos</h2>
  
    <p />
  
    <p />
    {#if errorMsg}
      <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    {#if okMsg}
      <p style="color: green">{okMsg}</p>
    {/if}
  
    <!-- Table -->
    <Table borderer>
      <thead>
        <tr>
          <th> País </th>
          <th> Juego </th>
          <th> Año </th>
          <th> Unidades vendidas </th>
          <th> Compañia </th>
          <th>Acciones</th>
        </tr>
      </thead>
      
      <tbody>
              <tr>
                  <td><input bind:value={newStat.country}></td>
                  <td><input bind:value={newStat.game}></td>
                  <td><input type=number bind:value={newStat.year}></td>
                  <td><input type=number bind:value={newStat["sold-unit"]}></td>
                  <td><input bind:value={newStat.company}></td>
                  
                  <td><Button on:click={insertStat}>insertar</Button></td>
              </tr>
              
              {#each gamesStats as data}
                  <tr>
                      <td><a href="#/games/{data.country}/{data.year}">{data.country}</a></td>
                      <td>{data.game}</td>
                      <td>{data.year}</td>
                      <td>{data["sold-unit"]}</td>
                      <td>{data.company}</td>
                      
                      <td><Button on:click={deleteStat(data.country,data.year)}>Borrar</Button></td>
                      
                  </tr>
              
              {/each}
              
                     
              
                  
          </tbody>
      
    </Table>
  
    <!-- Pagination -->
    <Pagination ariaLabel="Web pagination">
      <PaginationItem class={current_page === 1 ? "disabled" : ""}>
        <PaginationLink
          previous
          href="#/games"
          on:click={() => changePage(current_page - 1, current_offset - 10)}
        />
      </PaginationItem>
      {#each range(last_page, 1) as page}
        <PaginationItem class={current_page === page ? "active" : ""}>
          <PaginationLink
            previous
            href="#/games"
            on:click={() => changePage(page, (page - 1) * 10)}
            >{page}</PaginationLink
          >
        </PaginationItem>
      {/each}
      <PaginationItem class={current_page === last_page ? "disabled" : ""}>
        <PaginationLink
          next
          href="#/games"
          on:click={() => changePage(current_page + 1, current_offset + 10)}
        />
      </PaginationItem>
    </Pagination>
  </main>
  
  <style>
    main {
      text-align: center;
      padding: 1em;
      margin: 0 auto;
    }
  
    h2 {
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
    }
  </style>