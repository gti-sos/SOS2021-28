<script>
    import { onMount } from "svelte";
    import { Table, Button, Nav, NavItem, NavLink } from "sveltestrap";

    //var zingchart = require("zingchart");
    
    const BASE_CONTACT_API_PATH = "/api/v1";
    let pData = [];
    let pChartData = [];
    
  let countryWinnerData = [];
  let awardData = [];
  //let winnerData = []
  let yearData = [];
  let galaData = [];
  let nPlatformData = [];
  let nAwardData = [];
  
    let errorMsg = "";
    let okMsg = "";
    function distinctRecords(MYJSON, prop) {
      return MYJSON.filter((obj, pos, arr) => {
        return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
    }
    async function loadChart() {
      console.log("Fetching data...");
      const res = await fetch(BASE_CONTACT_API_PATH + "/awards");
      pData = await res.json();
      if (res.ok) {
        pData.forEach(stat => {
        countryWinnerData.push(stat.country +"-"+stat.winner);
        //platChartData.push(stat.platform);
        galaData.push(stat.gala)
        yearData.push(stat.year);
        nPlatformData.push(stat["n-platform"]);
        nAwardData.push(stat["n-award"]);
        
        });
      }
      console.log("awards Chart DaTa: " + pChartData);

      var colors = Highcharts.getOptions().colors;

      Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'valores de la Api awards'
    },
    
    xAxis: {
        categories: countryWinnerData,
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'valores',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' millions'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle",
        },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Año',
        data: yearData
        
    }, {
        name: 'Gala',
        data: galaData
    }, {
        name: 'Numero de plataformas',
        data: nPlatformData
    }, {
        name: 'Numero de premios',
        data: nAwardData
    }]
});

      /*
      Highcharts.chart("container", {
        title: {
          text: "Grafica de Awards",
        },
        yAxis: {
          title: {
            text: "Valor",
          },
        },
        xAxis: {
          title: {
            text: "País",
          },
          categories: countryWinnerData,
        },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle",
        },
        annotations: [
          {
            labels: [
              {
                point: "date",
                text: "",
              },
              {
                point: "min",
                text: "Min",
                backgroundColor: "white",
              },
            ],
          },
        ],
        series: [
          
          {
            name: "Año",
            data: yearData,
          },
          { 
            name: "Gala",
            data: galaData,
          },
          {
            name: "numero de plataformas",
            data: nPlatformData,
          },
          {
            name: "numero de premios",
            data: nAwardData,
          }
          
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      });

      */
      
    }
    
  </script>
  <svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script
      src="https://code.highcharts.com/modules/accessibility.js"
      on:load={loadChart}></script>
  </svelte:head>
  <main>
    <Nav>
      <NavItem>
        <NavLink href="/">Página Principal</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#/awards">Datos</NavLink>
      </NavItem>
    </Nav>
  
    <div>
      <h2>
        Análiticas
      </h2>
    </div>
  
    <div>
      {#if errorMsg}
        <p class="msgRed" style="color: #9d1c24">ERROR: {errorMsg}</p>
      {/if}
      {#if okMsg}
        <p class="msgGreen" style="color: #155724">{okMsg}</p>
      {/if}
    </div>
  
    <div>
      <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Grafica de HighCharts donde se aprecian todos los valores de la API Awards
        </p>
    </figure>
    </div>
  </main>

  <style>
    @import 'https://code.highcharts.com/css/highcharts.css';

.highcharts-figure, .highcharts-data-table table {
    min-width: 310px; 
	max-width: 800px;
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


/* Link the series colors to axis colors */
.highcharts-color-0 {
	fill: #7cb5ec;
	stroke: #7cb5ec;
}
.highcharts-axis.highcharts-color-0 .highcharts-axis-line {
	stroke: #7cb5ec;
}
.highcharts-axis.highcharts-color-0 text {
	fill: #7cb5ec;
}
.highcharts-color-1 {
	fill: #90ed7d;
	stroke: #90ed7d;
}
.highcharts-axis.highcharts-color-1 .highcharts-axis-line {
	stroke: #90ed7d;
}
.highcharts-axis.highcharts-color-1 text {
	fill: #90ed7d;
}


.highcharts-yaxis .highcharts-axis-line {
	stroke-width: 2px;
}
  </style>