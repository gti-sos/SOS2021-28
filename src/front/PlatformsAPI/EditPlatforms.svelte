<script>
  import { onMount } from "svelte";

  import { Table, Button, Nav, NavItem, NavLink } from "sveltestrap";

  const BASE_CONTACT_API_PATH = "/api/v1";
  export let params = {};
  let stat = {};
  
  let updateCountry = "XXXX";
  let updatePlatform = "XXXX";
  let updateYear = 1999;
  let updateSold = 999999;
  let updateGeneration = 99;

  let errorMsg = "";
  let okMsg = "";
  
  async function getStat() {
    console.log("Fetching stat..." + params.country + " " + params.year);
    const res = await fetch(
      BASE_CONTACT_API_PATH +"/platforms/" + params.country +"/" + params.year
    );

    if (res.ok) {
      console.log("Ok:");
      const json = await res.json();
      stat = json;
      updateCountry = stat.country;
	  updatePlatform = stat.platform;
      updateYear = stat.year;
      updateSold = stat["sold-unit"];
      updateGeneration = stat.generation;

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

  async function updatePlatformsss() {
console.log("Updating platform..." + JSON.stringify(params.country));
const res = await fetch("/api/v1/platforms/" + params.country + "/" + params.year, {
    method: "PUT",
    body: JSON.stringify({
        "country": params.country,
		"platform": updatePlatform,
        "year": params.year,
        "sold-unit": updateSold,
        "generation": updateGeneration,
    }),
    headers: {
        "Content-Type": "application/json"
    }
}).then(function (res) {
       okMsg = "Operación realizada correctamente, vuelva atras para ver todos los datos en la tabla";
      //getStat();
      if (res.ok) {
        console.log("OK");
        getAward();
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
      <NavLink href="#/platforms">Volver</NavLink>
    </NavItem>
  </Nav>

  <h2>
    Editar campo 
	<strong>{params.country}</strong>
	
    <strong>{params.year}</strong>
  </h2>
  <Table bordered>
    <thead>
      <tr>
        <th> País </th>
        <th> Plataforma </th>
        <th> Año </th>
        <th> Unidades vendidas </th>
        <th> Generación </th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{params.country}</td>
		<td><input bind:value="{updatePlatform}"></td>
        <td>{params.year}</td>
        <td><input type="number" bind:value={updateSold} /></td>
        <td><input type="number" bind:value={updateGeneration} /></td>
        <td>
          <Button outline color="primary" on:click={updatePlatformsss}>Actualizar</Button>
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