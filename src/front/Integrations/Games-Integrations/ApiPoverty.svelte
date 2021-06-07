<script>
    import { onMount } from "svelte";
  
    import { Table, Button, Nav, NavItem, NavLink } from "sveltestrap";
  
    const BASE_CONTACT_API_PATH = "/api/v1";
  
    let gamesData = [];
    let gamesChartData = [];
  
  let gamesChartCountry = [];
  let gamesChartGame = [];
  let gamesChartYear = [];
  let gamesChartUnit = [];
  let gamesChartCompany = [];

  let povertyData = [];
  let povertyChartCountry = [];
  let povertyChartYear = [];
  let povertyChartPeople_in_risk_of_poverty = [];
  let povertyChartPeople_poverty_line = [];
  let povertyChartHome_poverty_line = [];
  let povertyChartPercentage_risk_of_poverty = [];
  
  let urlproxy = "/proxy-poverty/"
  
  async function getDataGraph() {
        console.log("Fetching data...");
        const res = await fetch(BASE_CONTACT_API_PATH + "/games");
        gamesData = await res.json();
        if (res.ok) {
            console.log(`We have received ${gamesData.length} resources.`);
          gamesData.forEach(stat => {
        gamesChartCountry.push(stat.country);
        gamesChartGame.push(stat.game);
        gamesChartYear.push(stat.year);
        gamesChartUnit.push(stat["sold-unit"]);
        gamesChartCompany.push(stat.company)
        });
        console.log("Done");
      }
      await fetch("https://endpoint-poverty-risks.herokuapp.com/api/v1/loadInitialData");
      const res2 = await fetch(urlproxy + "/api/v1/");
        if (res2.ok) {
            console.log("Ok");
            const json = await res2.json();
            povertyData = json;
            console.log(`We have received ${povertyData.length} resources.`);
            povertyData.forEach((data) => {
                povertyChartCountry.push(data.country);
                povertyChartYear.push(data.year);
                povertyChartPeople_in_risk_of_poverty.push(data.people_in_risk_of_poverty);
            });            
        } else {
            console.log("Error");
        }



var chart = c3.generate({
  bindto: '#chart',
    data: {
      x : 'x',
        columns: [
            ['x', gamesChartYear[0], gamesChartYear[1], gamesChartYear[2], gamesChartYear[3], gamesChartYear[4], gamesChartYear[5]],
            ['Unidades Vendidas', gamesChartUnit[0], gamesChartUnit[1], gamesChartUnit[2], gamesChartUnit[3], gamesChartUnit[4], gamesChartUnit[5]],
        ['Personas en riesgo de pobreza', povertyChartPeople_in_risk_of_poverty[0], povertyChartPeople_in_risk_of_poverty[1],povertyChartPeople_in_risk_of_poverty[2],povertyChartPeople_in_risk_of_poverty[3],povertyChartPeople_in_risk_of_poverty[4],povertyChartPeople_in_risk_of_poverty[5]],
        ],
        
        type : 'pie',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        
        /*
        type: 'area-step',
        labels: true
        */
    },
    grid: {
        y: {
            lines: [{value: 0}]
        }
    },
    bar: {
        width: {
            ratio: 0.5 
        }
    }
});
}
  
</script>




<svelte:head>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.js" on:load={getDataGraph}></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.11/c3.js" on:load={getDataGraph}></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.11/c3.css" rel="stylesheet" type="text/css">
</svelte:head>

<main>
  <Nav>
    <NavItem>
      <NavLink href="/">Página Principal</NavLink>
    </NavItem>
    <NavItem>
      <NavLink href="#/games">Datos</NavLink>
    </NavItem>
  </Nav> 
  <div id="chart"></div> 
</main>

<style>
</style>