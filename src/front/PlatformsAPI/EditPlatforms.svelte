<script>

  import { onMount } from "svelte";
  import { Table, Button } from "sveltestrap";
  const BASE_CONTACT_API_PATH = "/api/v1";
  
  
  export let params = {};
  let stat = {};
  
  let updateCountry = "XXXX";
  let updatePlatform = "XXXX";
  let updateYear = 1999;
  let updateSold = 999;
  let updateGeneration = 999;
  
  
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
	  updateSold = stat["sold-units"];
      updateGeneration = stat.generation;
     
      console.log("Received stat.");
      
    } else {
      errorMsg = res.status + ": " + res.statusText;
      okMsg="";
      console.log("ERROR!" + errorMsg);
    }
  }
  async function updateStat() {
    console.log(
      "Updating stat..." +
        JSON.stringify(params.country) +
        JSON.stringify(params.year)
    );
    const res = await fetch(
      BASE_CONTACT_API_PATH +
        "/platforms/" +
        params.country +
        "/" +
        params.year,
      {
        method: "PUT",
        body: JSON.stringify({
		
          "country": params.country,
		  "platform": params.platform,
          "year": parseInt(params.year),
          "sold-unit": parseInt(updateSold),
          "Generation": parseInt(updateGeneration),
          
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }
    ).then(function (res) {
      if (res.ok) {
        console.log("OK");
        getStat();
        errorMsg = "";
        okMsg = "Operación realizada correctamente";
      } else {
        errorMsg = res.status + ": " + res.statusText;
        okMsg = "";
        getStat();
        console.log("ERROR!" + errorMsg);
      }
    });
  }
  onMount(getStat);
</script>

<main>
  <h3>
    Editar campo 
	<strong>{params.country}</strong>
	<strong>{params.platform}</strong>
    <strong>{params.year}</strong>
  </h3>
  <Table bordered>
    <thead>
      <tr>
        <th> País </th>
        <th> Plataforma </th>
        <th> Año </th>
        <th> Unidades Vendidas </th>
        <th> Generacion </th>
        <th> Acciones </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{updateCountry}</td>
		<td>{updatePlatform}</td>
        <td>{updateYear}</td>
        <td><input type="number" bind:value={updateSold} /></td>
        <td><input type="number" bind:value={updateGeneration} /></td>
        <td>
          <Button outline color="primary" on:click={updateStat}>Actualizar</Button>
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
  <a href="#/platforms"
    ><Button outline color="secondary">Volver</Button></a
  >
</main>

<style>
  main{
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>