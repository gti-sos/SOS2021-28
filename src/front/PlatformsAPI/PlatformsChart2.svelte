<script>
    //https://www.anychart.com/products/anychart/gallery/Pie_and_Donut_Charts/Donut_Chart.php
    
    import {Nav,NavItem,NavLink} from "sveltestrap";
    import {} from "anychart";
    
    let BASE_API_URL = "/api/v1";
    
    let country = [];
    let pData = [];

    let platChartCountryData = [];
    let platChartPlatformData = [];
    let platChartYearData = [];
    let platChartSoldUnitData = [];
    let platChartGenerationData = [];
    
    anychart.onDocumentReady(async function () {
        //Obtenemos paises
        let paawards = [];
        const data = await fetch(BASE_API_URL + "/platforms");
        paawards = await data.json();
        paawards.forEach((x) => {
            if (!country.includes(x.country)){
                country.push(x.country);
            }
        });
        var paises = [];
        for (const c of country){
            const res = await fetch(BASE_API_URL + `/platforms?country=${c}`);
            pData = await res.json();
            var array = [];
            if (res.ok) {
                var ventas = [];
                ventas.push(`${c}`);
                pData.forEach(stat => {

                    //platChartCountryData.push(stat.country +"-"+stat.platform);
                    //platChartPlatformData.push(stat.platform);
                    //platChartYearData.push(stat.year);
                    ventas.push(stat["sold-unit"]);
                    //platChartGenerationData.push(stat.generation);
                 });
                /*
                const json = await res.json();
                
                array.push(`${c}`);
                 json.forEach((p) => {
                     console.log(p["sold-unit"]);
                   // var trofeos = parseInt(p.platform);
                    //suma=suma+trofeos;
                });
                */
            } 
            else {
                ventas.push(`${c}`);
                ventas.push(0);
            }
            paises.push(ventas);
        }
      // create pie chart with passed data
      var chart = anychart.pie(paises);
      // set chart title text settings
      chart
        .title('Gráfico que muestra las plataformas vendidas por paises')
        // set chart radius
        .radius('43%')
        // create empty area in pie chart
        .innerRadius('30%');
      // set container id for the chart
      chart.container('container');
      // initiate chart drawing
      chart.draw();
    });
</script>

<svelte:head>
    <script src="https://cdn.anychart.com/releases/v8/js/anychart-base.min.js"></script>
    <script src="https://cdn.anychart.com/releases/v8/js/anychart-ui.min.js"></script>
    <script src="https://cdn.anychart.com/releases/v8/js/anychart-exports.min.js"></script>
    <link href="https://cdn.anychart.com/releases/v8/css/anychart-ui.min.css" type="text/css" rel="stylesheet">
    <link href="https://cdn.anychart.com/releases/v8/fonts/css/anychart-font.min.css" type="text/css" rel="stylesheet">
</svelte:head>

<main>
    <div id="container"></div>
</main>

<style>
    html,
    body,
    #container {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
</style>