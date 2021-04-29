<script>
    import {
        onMount
    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";

    let awards = [];

    async function getAwards(){
        console.log("Fetching awards ...");
        const res = await fetch("/api/v1/awards/");
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            awards = json;
            console.log(`We have received ${awards.length} awards.`);
        }else{
            console.log("Error!");
        }
    }
    onMount(getAwards);
</script>

<main>
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
            {#each awards as data}
                <tr>
                    <td>{data.country}</td>
                    <td>{data.year}</td>
                    <td>{data.gala}</td>
                    <td>{data.winner}</td>
                    <td>{data["n-platform"]}</td>
                    <td>{data["n-award"]}</td>
                </tr>
            {/each}
        </tbody>
    </Table>
    
</main>