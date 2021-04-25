<script>
    import {
        onMount
    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";

    let platforms = [];

    async function getPlatforms(){
        console.log("Fetching platforms ...");
        const res = await fetch("/api/v1/platforms/");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            games = json;
            console.log(`We have received ${platforms.length} platforms.`);
        }else{
            console.log("Error!");
        }
        /*
        console.log(`Before getPlatforms.`);
        getPlatforms();
        console.log(`After getPlatforms.`);
        */
    }
    onMount(getPlatforms);
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
                <td>platform</td>
                <td>year</td>
                <td>sold-unit</td>
                <td>generation</td>
                
            </tr>
        </thead>
        <tbody>
            {#each platforms as data}
                <tr>
                    <td>{data.country}</td>
                    <td>{data.platform}</td>
                    <td>{data.year}</td>
                    <td>{data["sold-unit"]}</td>
                    <td>{data.generation}</td>
                </tr>
            {/each}
        </tbody>
    </Table>
    
</main>