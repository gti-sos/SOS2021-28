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
  
  
  async function getDataGraph() {
        console.log("Fetching data...");
        const res = await fetch(BASE_CONTACT_API_PATH + "/games");
        gamesData = await res.json();
        if (res.ok) {
          gamesData.forEach(stat => {
        gamesChartCountry.push(stat.country);
        gamesChartGame.push(stat.game);
        gamesChartYear.push(stat.year);
        gamesChartUnit.push(stat["sold-unit"]);
        gamesChartCompany.push(stat.company)
        });
        console.log("Done");
      }



/*
        var chart = c3.generate({
    bindto: '#chart',
    data: {*/
        //x : 'x',
      //columns: [
        //['x', 2015, 2016, 2017, 2018, 2019, 2020],
        //['sold-unit', gamesChartUnit]
        //['Desempleo', 0,0,0,0,0,unemploymentTotal],
      //],
      /*
      axes: {
        Desempleo: 'y2'
      },*/

      /*
      types: {
        Desempleo: 'bar'
      }
    },
    axis: {
      y: {
        label: {
          text: 'Hola',
          position: 'outer-middle'
        },
      },
      x: {
        show: true,
        label: {
          text: 'Adios',
          position: 'outer-middle'
        }
      }
    }
});
    }
*/
var chart = c3.generate({
  bindto: '#chart',
    data: {
      x : 'x',
        columns: [
          //['x', gamesChartCountry[0], gamesChartCountry[1], gamesChartCountry[2], gamesChartCountry[3], gamesChartCountry[4], gamesChartCountry[5]],
          //['x', 2015, 2016, 2017, 2018, 2019, 2020],
          ['x', gamesChartYear[0], gamesChartYear[1], gamesChartYear[2], gamesChartYear[3], gamesChartYear[4], gamesChartYear[5]],
          ['Unidades Vendidas', gamesChartUnit[0], gamesChartUnit[1], gamesChartUnit[2], gamesChartUnit[3], gamesChartUnit[4], gamesChartUnit[5]],
          //['Año', gamesChartYear[0], gamesChartYear[1], gamesChartYear[2], gamesChartYear[3], gamesChartYear[4], gamesChartYear[5]],
          //['data1', gamesChartUnit],
            //['data2', 130, 100, 140, 200, 150, 50]
            
        ],
        type: 'bar',
        labels: true
    },
    grid: {
        y: {
            lines: [{value: 0}]
        }
    },
    bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
    }
});
/*
setTimeout(function () {
    chart.load({
        columns: [
            ['data3', 130, -150, 200, 300, -200, 100]
        ]
    });
}, 1000);
*/



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