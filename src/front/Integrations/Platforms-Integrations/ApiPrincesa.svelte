<script>
   
    //https://www.anychart.com/products/anychart/gallery/Bar_Charts/Multi-Series_Bar_Chart.php
   
    import {Nav,NavItem,NavLink} from "sveltestrap";
   
    let BASE_API = "/api/v1";

    let urlproxy = "/proxy-Princesa/"

    let paisesPaawards = ["Spain","Francia","EE.UU","Alemania"];
    let paisesPlatforms = ["Spain","France","U.S","Germany"];
    let arrayPaawards = ['Premios Princesa de Asturias'];
    let arrayPlatforms = ['Platforms'];
    
    anychart.onDocumentReady(async function () {
        for (var i=0; i<paisesPlatforms.length; i++){
            const res1 = await fetch(BASE_API + `/platforms?country=${paisesPlatforms[i]}`);
            if (res1.ok) {
                const json1 = await res1.json();
                json1.forEach((f) => {
                    arrayPlatforms.push(f["sold-unit"]);
                });
            } 
            else {
                arrayPlatforms.push(0);
            }
        }
        for (var j=0; j<paisesPaawards.length; j++){
            
            const res2 = await fetch(urlproxy + `/api/v1/paawards?country=${paisesPaawards[j]}`);
            if (res2.ok) {
                const json2 = await res2.json();
                var suma2 = 0;
                json2.forEach((p) => {
                    var trofeo = parseInt(p.trophy);
                    suma2=suma2+trofeo;
                });
                arrayPaawards.push(suma2);
            } 
            else {
                arrayPaawards.push(0);
            }
        }
      // create data set on our data
      var dataSet = anychart.data.set([
        arrayPaawards,
        arrayPlatforms
      ]);
      // map data for the first series, take x from the zero column and value from the first column of data set
      var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });
      // map data for the second series, take x from the zero column and value from the second column of data set
      var secondSeriesData = dataSet.mapAs({ x: 0, value: 2 });
      // map data for the third series, take x from the zero column and value from the third column of data set
      var thirdSeriesData = dataSet.mapAs({ x: 0, value: 3 });
      // map data for the fourth series, take x from the zero column and value from the fourth column of data set
      var fourthSeriesData = dataSet.mapAs({ x: 0, value: 4 });
      // create bar chart
      var chart = anychart.bar();
      // turn on chart animation
      chart.animation(true);
      chart.padding([10, 40, 5, 20]);
      // set chart title text settings
      chart.title('Integracion plataformas mas vendidas junto a Premios Princesa de Asturias de España, Francia, EE.UU y Alemania');
      // set scale minimum
      chart.yScale().minimum(0);
      chart.xAxis().labels().rotation(-90).padding([0, 0, 20, 0]);
      chart.yAxis().labels().format('{%Value}{groupsSeparator: }');
      // set titles for Y-axis
      chart.yAxis().title('');
      // helper function to setup settings for series
      var setupSeries = function (series, name) {
        series.name(name);
        series.hovered().labels(false);
        series
          .labels()
          .enabled(true)
          .position('right-center')
          .anchor('left-center')
          .format('${%Value}{groupsSeparator: }');
        series
          .tooltip()
          .position('right')
          .anchor('left-center')
          .offsetX(5)
          .offsetY(0)
          .titleFormat('{%X}')
          .format('{%SeriesName} : ${%Value}{groupsSeparator: }');
      };
      // temp variable to store series instance
      var series;
      // create first series with mapped data
      series = chart.bar(firstSeriesData);
      setupSeries(series, 'España');
      // create second series with mapped data
      series = chart.bar(secondSeriesData);
      setupSeries(series, 'Francia');
      // create third series with mapped data
      series = chart.bar(thirdSeriesData);
      setupSeries(series, 'Estados Unidos');
      // create fourth series with mapped data
      series = chart.bar(fourthSeriesData);
      setupSeries(series, 'Alemania');
      // turn on legend
      chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0]);
      chart.interactivity().hoverMode('single');
      chart.tooltip().positionMode('point');
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
    <Nav>
        <NavItem>
            <NavLink href="/#/integrations">Volver</NavLink>
        </NavItem>
    </Nav>
    <div id="container"></div>
</main>

<style>
    #container {
      width: 100%;
      height: 500px;
      margin: 0;
      padding: 0;
    }
</style>