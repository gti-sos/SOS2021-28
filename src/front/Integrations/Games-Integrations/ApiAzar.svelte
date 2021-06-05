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

  let azarData = [];
  let azarChartprovince = [];
  let azarChartYear = [];
  let azarChartCatering_bingo_machine = [];
  
  let urlproxy = "/azar-games/"
  
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
      const res1 = await fetch(urlproxy + "/api/v2/azar-games-and-bet-activities/loadInitialData");
      const res2 = await fetch(urlproxy + "/api/v2/azar-games-and-bet-activities");
        if (res2.ok) {
            console.log("Ok");
            const json = await res2.json();
            azarData = json;
            console.log(`We have received ${azarData.length} resources.`);
            azarData.forEach((data) => {
                azarChartprovince.push(data.province);
                azarChartYear.push(data.year);
                azarChartCatering_bingo_machine.push(data.catering_bingo_machine);
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
        ['Maquinas de bingo', azarChartCatering_bingo_machine[0], azarChartCatering_bingo_machine[1],azarChartCatering_bingo_machine[2],azarChartCatering_bingo_machine[3],azarChartCatering_bingo_machine[4],azarChartCatering_bingo_machine[5]],
        ],
        /*
        type : 'pie',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        */
        
        type: 'area-step',
        labels: true
        
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