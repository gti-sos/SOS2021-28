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
        } else {
            errorMsg = res.status + ": " + res.statusText;
            console.log("ERROR!" + errorMsg);
        }
    }

    async function updateAward() {

console.log("Updating award..." + JSON.stringify(params.country));

const res = await fetch("/api/v1/awards/" + params.country + "/" + params.year, {
    method: "PUT",
    body: JSON.stringify({
        "country": params.country,
        "year": params.year,
        "gala": updatedGala,
        "winner": updatedWinner,
        "n-platform": updatedNPlatforms,
        "n-award": updatedNAwards
    }),
    headers: {
        "Content-Type": "application/json"
    }
}).then(function (res) {
    getAward();
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
                <td>{params.year}</td>
                <td><input bind:value="{updatedGala}"></td>
                <td><input bind:value="{updatedWinner}"></td>
                <td><input bind:value="{updatedNPlatforms}"></td>
                <td><input bind:value="{updatedNAwards}"></td>
                <td> <Button outline  color="primary" on:click={updateAward}>Actualizar</Button> </td>
            </tr>
    </tbody>
    </Table>
{#if errorMsg}
    <p style="color: red">ERROR: {errorMsg}</p>
{/if}
<Button outline color="secondary" on:click="{pop}">Atras</Button>

</main>