<script>
    import { onMount } from "svelte";
    import { Table, Button, Nav, NavItem, NavLink } from "sveltestrap";
    
    const BASE_CONTACT_API_PATH = "/api/v1";
    let pData = [];
    let pChartData = [];
    
  let countryWinnerData = [];
  let awardData = [];
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
    }
  </script>
  <svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
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
        <div id="container" />
        <p class="highcharts-description">
          Gráfico de líneas básico que muestra los diferentes valores para los campos de awards.
        </p>
      </figure>
    </div>
  </main>