<script>
    import { onMount } from "svelte";
  
    import { Table, Button, Nav, NavItem, NavLink } from "sveltestrap";
  
    const BASE_CONTACT_API_PATH = "/api/v1";
    export let params = {};
    let stat = {};
    
    let updateCountry = "XXXX";
    let updateGame = "XXXX";
    let updateYear = 1999;
    let updateSoldUnit = 999999;
    let updateCompany = "XXXX";
    let errorMsg = "";
    let okMsg = "";
    
    async function getStat() {
      console.log("Fetching stat..." + params.country + " " + params.year);
      const res = await fetch(
        BASE_CONTACT_API_PATH +"/games/" + params.country +"/" + params.year
      );
  
      if (res.ok) {
        console.log("Ok:");
        const json = await res.json();
        stat = json;
        updateCountry = stat.country;
        updateGame = stat.game;
        updateYear = stat.year;
        updateSoldUnit = stat["sold-unit"];
        updateCompany = stat.company;
  
        console.log("Received stat.");
        
      } else {
        if(res.status===404){
            errorMsg = "No se encuentra el dato solicitado";
          }else if(res.status ===500){
            errorMsg = "No se han podido acceder a la base de datos";
          }        
          okMsg = "";
          console.log("ERROR!" + errorMsg);
      }
    }
  
    async function updateGames() {
  console.log("Updating games..." + JSON.stringify(params.country));
  const res = await fetch("/api/v1/games/" + params.country + "/" + params.year, {
      method: "PUT",
      body: JSON.stringify({
          "country": params.country,
          "game": updateGame,
          "year": parseInt(params.year),
          "sold-unit": updateSoldUnit,
          "company": updateCompany,
      }),
      headers: {
          "Content-Type": "application/json"
      }
  }).then(function (res) {
    okMsg = "Operación realizada correctamente, vuelva atras para ver todos los datos en la tabla";
      //getStat();
      if (res.ok) {
        console.log("OK");
        getStat();
        okMsg = "Operación realizada correctamente, vuelva atras para ver todos los datos en la tabla";
      } else {
        if(res.status===404){
          errorMsg = "No se encuentra el dato a editar";
        }else if(res.status ===500){
          errorMsg = "No se han podido acceder a la base de datos";
        }else if(res.status ===400){
          errorMsg = "se han introducido datos erroneos";
          }        
        okMsg = "";
        console.log("ERROR!" + errorMsg);
      }
  });
    }
  
    onMount(getStat);
  </script>
  
  <main>
    <Nav>
      <NavItem>
        <NavLink href="#/games">Volver</NavLink>
      </NavItem>
    </Nav>
  
    <h2>
      Editar campo 
      <strong>{params.country}</strong>
    </h2>
    <Table bordered>
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
          <!--
          <td>{updateCountry}</td>
          <td>{updateGame}</td>
          <td>{updateYear}</td>
          <td><input type="number" placeholder="200000" min="1"   bind:value={updateSoldUnit} /></td>
          <td>{updateCompany}</td>
          <td>
            <Button outline color="primary" on:click={updateGames}>Actualizar</Button>
          </td>
        -->
          <td>{params.country}</td>
          <td><input bind:value="{updateGame}"></td>
          <td>{params.year}</td>
          <td><input type=number bind:value="{updateSoldUnit}"></td>
          <td><input bind:value="{updateCompany}"></td>
          <td> 
            <Button outline  color="primary" on:click={updateGames}>Actualizar</Button> 
          </td>
        </tr>
      </tbody>
    </Table>
    {#if errorMsg}
      <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    {#if okMsg}
    <p style="color: green">{okMsg}</p>
    {/if}
  
  </main>
  
  <style>
    main{
      text-align: center;
      padding: 1em;
      margin: 0 auto;
    }
  </style>