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
        let pplatforms = [];
        const data = await fetch(BASE_API_URL + "/platforms");
        pplatforms = await data.json();
        pplatforms.forEach((x) => {
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
                   // platChartPlatformData.push(stat.platform);
                    //platChartYearData.push(stat.year);
                    ventas.push(stat["sold-unit"]);
                    //platChartGenerationData.push(stat.generation);
                 });
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
        .title('Gráfico que muestra el numero de las plataformas vendidas por paises')
        // set chart radius
        .radius('43%')
        // create empty area in pie chart
        .innerRadius('50%');
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
    <Nav>
        <NavItem>
            <NavLink href="#/platforms">Datos</NavLink>
        </NavItem>
    </Nav>
</main>

<style>
    html,
    body,
    #container {
      width: 100%;
      height: 500px;
      margin: 0;
      padding: 0;
    }
</style>