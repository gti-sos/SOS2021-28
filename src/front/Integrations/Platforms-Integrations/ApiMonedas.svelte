<script>

    import { pop } from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";


    async function loadGraph(){
        const res = await fetch("https://www.mercadobitcoin.net/api/BTC/trades/1501871369/1501891200/");
        let Array_data = [];
        if(res.ok){
            
            let json = await res.json();
            let data_bitcoin = json;
            let cont = 0;
            data_bitcoin.forEach( (e) => {
                cont += 1;
                if(cont < 10){
                    Array_data.push({name: "Tipo " + e.type, y: e.price, z: e.amount});
                }
                
            });
                 
        }else{
            console.log("Error al acceder a la API");
        }
        Highcharts.chart('container', {
            chart: {
                type: 'variablepie'
            },
            title: {
                text: ''
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                    'Precio: <b>{point.y}</b><br/>' +
                    'Cantidad: <b>{point.z}</b><br/>'
            },
            series: [{
                minPointSize: 10,
                innerSize: '20%',
                zMin: 0,
                name: 'types',
                data: Array_data
            }]
        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/variable-pie.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>

    <h1 style="text-align:center"></h1>
    <h4 style="text-align:center"><a href="https://www.mercadobitcoin.net/api/BTC/trades/1501871369/1501891200/">Información de monedas virtuales.</a></h4>

    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
    <Button outline color="secondary" on:click="{pop}">Volver</Button>
    
</main> 

<style>
    #container {
	height: 500px;
    }
    .highcharts-figure, .highcharts-data-table table {
        min-width: 320px; 
        max-width: 700px;
        margin: 1em auto;
    }
    .highcharts-data-table table {
        font-family: Verdana, sans-serif;
        border-collapse: collapse;
        border: 1px solid #EBEBEB;
        margin: 10px auto;
        text-align: center;
        width: 100%;
        max-width: 500px;
    }
    .highcharts-data-table caption {
        padding: 1em 0;
        font-size: 1.2em;
        color: #555;
    }
    .highcharts-data-table th {
        font-weight: 600;
        padding: 0.5em;
    }
    .highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
        padding: 0.5em;
    }
    .highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
        background: #f8f8f8;
    }
    .highcharts-data-table tr:hover {
        background: #f1f7ff;
    }
</style>