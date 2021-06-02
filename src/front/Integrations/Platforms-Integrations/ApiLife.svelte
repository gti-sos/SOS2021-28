<script>
  import{Nav, NavItem, NavLink } from "sveltestrap";


  let urlproxy = "/proxy-Life/"

  const BASE_LIFE_API_PATH = "/api/v2";

  let lifeData=[];
  let lifeChartCountryDate = [];
  let lifeChartQualityLifeI = [];
  let lifeChartPurchasingPowerI = [];
  let lifeChartSafetyI = [];
  let errorMsg="Tiene que cargar los datos para visualizar las analíticas.";
  let cargados = false;
  async function loadChart() {
      console.log("Fetching data...");
      const res = await fetch(urlproxy + "/api/v2/life-stats");

      lifeData = await res.json();
    /* if (res.ok) {
          lifeData.forEach(stat => {
          lifeChartCountryDate.push(stat.country+"-"+stat.date);
          lifeChartQualityLifeI.push(stat["quality_life_index"]);
          lifeChartPurchasingPowerI.push(stat["purchasing_power_index"]);
          lifeChartSafetyI.push(stat["safety_index"]);  
          });
          cargados=true;
      }*/
      lifeData.forEach((stat) => {
          let res = { 
          'name': stat.country+"-"+stat.date,
          'value': stat["quality_life_index"]
        };
        lifeChartQualityLifeI.push(res);
      });  
      console.log(lifeChartPurchasingPowerI);
      lifeData.forEach((stat) => {
          let res = { 
          'name': stat.country+"-"+stat.date,
          'value': stat["purchasing_power_index"]
        };
        lifeChartPurchasingPowerI.push(res);
      });       
      lifeData.forEach((stat) => {
          let res = { 
          'name': stat.country+"-"+stat.date,
          'value': stat["safety_index"]
        };
        lifeChartSafetyI.push(res);
      });       
        Highcharts.chart('container', {
          chart: {
              type: 'packedbubble',
              height: '100%'
          },
          title: {
              text: 'Life-stats'
          },
          tooltip: {
              useHTML: true,
              pointFormat: '<b>{point.name}:</b> {point.value} puchasing power'
          },
          plotOptions: {
              packedbubble: {
                  minSize: '30%',
                  maxSize: '100%',
                  zMin: 0,
                  zMax: 1000,
                  layoutAlgorithm: {
                      splitSeries: false,
                      gravitationalConstant: 0.02
                  },
                  dataLabels: {
                      enabled: true,
                      format: '{point.name}',
                      filter: {
                          property: 'y',
                          operator: '>',
                          value: 250
                      },
                      style: {
                          color: 'black',
                          textOutline: 'none',
                          fontWeight: 'normal'
                      }
                  }
              }
          },
          series:  [{
              name: 'Index purchasing power',
              data: lifeChartPurchasingPowerI
          },
          {
              name: 'Index quality life',
              data: lifeChartQualityLifeI
          },
          {
              name: 'Index safety',
              data: lifeChartSafetyI
          }]
      });
  }        
    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts.src.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    //<script src="https://code.highcharts.com/modules/exporting.js"></script>
    //<script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadChart}></script>
</svelte:head>

<main>
  <Nav>
      <NavItem>
        <NavLink href="/">Página Principal</NavLink>
      </NavItem>
      <NavItem>
            <NavLink href="/#/integrations">Volver</NavLink>
      </NavItem>
  </Nav>

  <div>
      <h2>
        Análiticas
      </h2>
    </div>

    <figure class="highcharts-figure">
      <div id="container"></div>
  </figure>

</main>

<style>
  main {
      text-align: center;
      padding: 30px;       
  }
  
  .highcharts-figure, .highcharts-data-table table {
  min-width: 320px; 
  max-width: 800px;
  margin: 1em auto;
}
#container {
  height: 800px;
}
.highcharts-tooltip h3 {
margin: 0.3em 0;
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