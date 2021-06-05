<script>
  import { onMount } from "svelte";
  import {Jumbotron, Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,} from 'sveltestrap';



  let urlproxy = "/proxy-social"
  var BASE_API_PATH = urlproxy + "/api/v2/province-budget-and-investment-in-social-promotion";
  
  let budgetGraph = [];
  let budgetGraphX = [];
  let budgetGraphBudget = [];
  let budgetGraphInvest = [];
  let budgetGraphLiquid = [];
  let budgetGraphPercentage = [];

  async function loadGraph() {
      const res = await fetch(BASE_API_PATH, {mode: "no-cors"});
      budgetGraph = await res.json();
      if (res.ok) {
          budgetGraph.forEach(budgetSvelte => {
          budgetGraphX.push(budgetSvelte.province + "/" + budgetSvelte.year);
          budgetGraphBudget.push(budgetSvelte.budget);
          budgetGraphInvest.push(budgetSvelte.invest_promotion);
          budgetGraphLiquid.push(budgetSvelte.liquid);
          budgetGraphPercentage.push(budgetSvelte.percentage);   
          
      });
      budgetGraphX.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
      budgetGraphX.sort((a,b) => (a.province > b.province) ? 1 : ((b.province > a.province) ? -1 : 0));
    }

    let chartConfig = {
      type: 'nestedpie',
      backgroundColor: '#ffffff',
      guide: {
        marker: {
          type: 'triangle',
          size: '7px'
        },
      },
      title: {
        text: 'Datos relacionados con la promocion social',
        backgroundColor: '#ffffff',
        fontColor: '#000'
      },
      legend: {
        align: 'center',
        backgroundColor: '#e0e0e0',
        borderColor: '#fff',
        layout: 'x4',
        shadow: false,
        verticalAlign: 'bottom'
      },
      
      scaleX: {
        
        item: {
          
          
        },
        label: {
          text: 'region'
        },
        values: budgetGraphX,
        
      },
      
      
      
      series: [{
          text: 'Presupuestos',
          values: budgetGraphBudget,
          backgroundColor: '#0ce9d1',
          lineColor: '#0ce9d1'
        },
        {
          text: 'liquido',
          values: budgetGraphLiquid,
          backgroundColor: '#e7ffcc',
          lineColor: '#e7ffcc'
        },
        {
          text: 'Inversion',
          values: budgetGraphInvest,
          backgroundColor: '#ccfff9',
          lineColor: '#ccfff9'
        },
        {
          text: 'porcentaje',
          values: budgetGraphPercentage,
          backgroundColor: '#8bdceb',
          lineColor: '#8bdceb'
        }
      ]
    }
    
    // RENDER CHARTS
    // -----------------------------
    zingchart.render({
      id: 'myChart',
      data: chartConfig
    });
  

}
</script>

<svelte:head>
  <script
    src="https://cdn.zingchart.com/zingchart.min.js"
    on:load={loadGraph}></script>
</svelte:head>

<main>
  <h1> Grafica de la API Awards </h1>
  <div id="myChart"></div>
</main>
