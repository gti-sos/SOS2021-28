<script>
    import { onMount } from "svelte";
    import { Table, Button, Nav, NavItem, NavLink } from "sveltestrap";
    
    const BASE_CONTACT_API_PATH = "/api/v1";
    let pDataAwards = [];
    let pDataGames = [];
    let pDataPlatforms = [];
    let pChartData = [];
    
  let countryData = [];
  let yearData = [];
  let soldUnitPlatformData = [];
  let nAwardData = [];
  let unitGamesData = [];

  
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
      pDataAwards = await res.json();
      if (res.ok) {
        pDataAwards.forEach(stat => {
        if (stat.country in countryData){
            console.log("ya esta almacenado el country" + stat.country)
        }else{
            countryData.push(stat.country);
        }
        if (stat.year in yearData){
            console.log("ya esta almacenado el year" + stat.year)
        }else{
            yearData.push(stat.year);
        } 
        nAwardData.push(stat["n-award"]);
        unitGamesData.push("sin datos");
        soldUnitPlatformData.push("sin datos");
        });
    }
      const res1 = await fetch(BASE_CONTACT_API_PATH + "/games");
      pDataGames = await res1.json();
      if (res1.ok) {
        pDataGames.forEach(stat => {
            if (stat.country in countryData){
            console.log("ya esta almacenado el country" + stat.country)
        }else{
            countryData.push(stat.country);
        }
       
        if (stat.year in yearData){
            console.log("ya esta almacenado el year" + stat.year)
        }else{
            yearData.push(stat.year);
        } 
        unitGamesData.push(stat["sold-unit"]);
        soldUnitPlatformData.push("sin datos");
        nAwardData.push("sin datos");
        });
    }
      const res2 = await fetch(BASE_CONTACT_API_PATH + "/platforms");
      pDataPlatforms = await res2.json();
      if (res2.ok) {
        pDataPlatforms.forEach(stat => {
            if (stat.country in countryData){
            console.log("ya esta almacenado el country" + stat.country)
        }else{
            countryData.push(stat.country);
        }
        if (stat.year in yearData){
            console.log("ya esta almacenado el year" + stat.year)
        }else{
            yearData.push(stat.year);
        } 
        soldUnitPlatformData.push(stat["sold-unit"]);
        nAwardData.push("sin datos");
        unitGamesData.push("sin datos");
        });
    
      }
      
      console.log("awards Chart DaTa: " + pChartData);
      Highcharts.chart("container", {
        chart: {
            type: 'spline'
        },
        title: {
          text: "Grafica General",
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
          categories: countryData,
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
            name: "Juegos vendidos",
            data: unitGamesData,
          },
          {
            name: "Consolas vendidas",
            data: soldUnitPlatformData,
          },
          {
            name: "Numero de premios",
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
        <NavLink href="/">Volver</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#/awards">Datos sobre Premios</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#/platforms">Datos sobre Plataformas</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#/games">Datos sobre Juegos</NavLink>
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
          Gráfico de type: 'spline' que muestra los diferentes valores de las diferentes apis implementadas.
        </p>
      </figure>
    </div>
  </main>