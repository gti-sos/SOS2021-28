<script>
    import { onMount } from "svelte";

    async function loadGraph(){

        let grmysData = [];
        let grmysGraph = [];
        let grmysCountry = [];
       
        
        const data = await fetch("https://sos2021-22.herokuapp.com/api/v2/grmys");
        if(data.ok){
            grmysData = await data.json();
            grmysData.forEach( (x) => {
            grmysGraph.push({text: x.name, values: [parseInt(x.award)]});
            grmysCountry.push(x.country)
        });
            
        } if(data.status == 404){
            console.log("cargando valores de la api...")
            const data = await fetch("https://sos2021-22.herokuapp.com/api/v2/grmys/loadInitialData");
            
        }

       
        var myConfig = {
                    type: 'chord',
                    'legend':{},
                          options: {
                            anglePadding: 0,
                            colorType: 'palette',
                            palette: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'],
                            style: {
                            label: {
                                visible: false
                            }
                            }
                        },
                    series: grmysGraph

        };

        zingchart.render({
            id: 'myChart',
            data: myConfig,
            
        });
    }
    onMount(loadGraph);

</script>

<svelte:head>

  <script
    src="https://cdn.zingchart.com/zingchart.min.js"
    on:load={loadGraph}></script>
</svelte:head>

<main>
    <div id="myChart"> Grafica de los datos integrados de la api Grmmys</div>
</main>

