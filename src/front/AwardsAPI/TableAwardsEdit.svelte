<script>
    import {
        onMount
    } from "svelte";

    import {
        pop
    } from "svelte-spa-router";

    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    export let params = {};
    let award = {};
    let updatedCountry = "XXXX";
    let updatedYear = 0;
    let updatedGala = 0;
    let updatedWinner = "XXXX";
    let updatedNPlatforms = 0;
    let updatedNAwards = 0;
    let errorMsg = "";
    let okMsg = "";
    onMount(getAward);
    async function getAward() {

        console.log("Fetching award...");
        const res = await fetch("/api/v1/awards/" + params.country  + "/" + params.year);

        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            award = json;
            updatedCountry = award.country;
            updatedYear = award.year;
            updatedGala = award.gala;
            updatedWinner = award.winner;
            updatedNPlatforms = award["n-platform"]
            updatedNAwards = award["n-award"]
            
            console.log("Received contact.");
        }else {
            if(res.status===404){
                errorMsg = "No se encuentra el dato solicitado";
                }else if(res.status ===500){
                errorMsg = "No se han podido acceder a la base de datos";
                }        
                okMsg = "";
                console.log("ERROR!" + errorMsg);
            }
    }

    async function updateAward() {

console.log("Updating award..." + JSON.stringify(params.country));

const res = await fetch("/api/v1/awards/" + params.country + "/" + params.year, {
    method: "PUT",
    body: JSON.stringify({
        "country": params.country,
        "year": parseInt(params.year),
        "gala": updatedGala,
        "winner": updatedWinner,
        "n-platform": updatedNPlatforms,
        "n-award": updatedNAwards
    }),
    headers: {
        "Content-Type": "application/json"
    }
}).then(function (res) {
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


</script>

<main>
    <h3>Editar contacto <strong>{params.country}</strong></h3>
    <Table bordered>
        <thead>
            <tr>
                <th>pais</th>
                <th>año</th>
                <th>gala</th>
                <th>ganador</th>
                <th>numero de plataformas</th>
                <th>numero de premios ganados</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                
                <td>{params.country}</td>
                <td>  {updatedYear}</td>
                <td><input type=number bind:value="{updatedGala}"></td>
                <td><input bind:value="{updatedWinner}"></td>
                <td><input type=number bind:value="{updatedNPlatforms}"></td>
                <td><input type=number bind:value="{updatedNAwards}"></td>
                <td> <Button outline  color="primary" on:click={updateAward}>Actualizar</Button> </td>
            </tr>
    </tbody>
    </Table>
    {#if errorMsg}
        <p style="color: red">ERROR: {errorMsg}</p>
    {/if}
    {#if okMsg}
        <p style="color: green">{okMsg}</p>
    {/if}
<Button outline color="secondary" on:click="{pop}">Atras</Button>

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
      font-size: 4em;
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