<script>
 

    import {
        onMount
    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    let awards = [];
    let newAward = {
        "country": "",
        "year": 0,
        "gala": 0,
        "winner": "",
        "n-platform":0,
        "n-award":0
        

    }

    const BASE = "/api/v1";

    async function getAwards(){
        console.log("Fetching awards ...");
        const res = await fetch(BASE +"/awards");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            awards = json;
            console.log(`We have received ${awards.length} awards.`);
        }else{
            console.log("Error!");
        }
    }

    async function insertAwards(){
        console.log("Inserting award "+ JSON.stringify(newAward));

        const res = await fetch(BASE +"/awards",
                            {
                                method: "POST",
                                body: JSON.stringify(newAward),
                                headers:{
                                    "Content-Type": "application/json"
                                }
                            }
                           ).then( (res) => {
                               getAwards();
                           })
    }
    
    async function deleteAwards(AwardCountry,AwardYear){
        console.log("Deleting contact with name "+ AwardCountry + "/" + AwardYear);

        const res = await fetch(BASE +"/awards/" + AwardCountry + "/" + AwardYear,
                            {
                                method: "DELETE"
                            }
                           ).then( (res) => {
                               getAwards();
                           })
    }

    async function deleteAllAwards(){
        console.log("Deleting contact with name ");

        const res = await fetch(BASE +"/awards/",
                            {
                                method: "DELETE"
                            }
                           ).then( (res) => {
                               getAwards();
                           })
    }
    onMount(getAwards);

</script>

<main>
    <h1>Tabla relacionada con los premios a videojuegos</h1>
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
    
</main>