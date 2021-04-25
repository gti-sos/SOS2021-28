<script>
    import {
        onMount
    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";

    let games = [];

    async function getGames(){
        console.log("Fetching games ...");
        const res = await fetch("/api/v1/games/");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            games = json;
            console.log(`We have received ${games.length} games.`);
        }else{
            console.log("Error!");
        }
        /*
        console.log(`Before getGames.`);
        getGames();
        console.log(`After getGames.`);
        */
    }
    onMount(getGames);
</script>

<main>
    <!--
    <table>
        <tr>
            <td>My cell</td>
        </tr>
    </table>
    -->
    <Table bordered>
        <thead>
            <tr>
                <td>country</td>
                <td>game</td>
                <td>year</td>
                <td>sold-unit</td>
                <td>company</td>
                
            </tr>
        </thead>
        <tbody>
            {#each games as data}
                <tr>
                    <td>{data.country}</td>
                    <td>{data.game}</td>
                    <td>{data.year}</td>
                    <td>{data["sold-unit"]}</td>
                    <td>{data.company}</td>
                </tr>
            {/each}
        </tbody>
    </Table>
    
</main>