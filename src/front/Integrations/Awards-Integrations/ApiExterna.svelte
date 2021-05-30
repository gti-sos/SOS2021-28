<script>

    async function loadGraph(){

    let covid = []
    let covidConfirmado = []
    let covidDeath = []
    let covidRecovered = []
    let covidProvince = []

    
    const data = await fetch("https://covid-19-statistics.p.rapidapi.com/reports?region_name=Spain", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "b84f6dbfd4msh9315e750631492ap131205jsnea9924bbe540",
		"x-rapidapi-host": "covid-19-statistics.p.rapidapi.com"
	}

    });
    if(data.ok){
        covid = await data.json();
        console.log(covid)
        covid.data.forEach(e => {
            covidConfirmado.push(e.confirmed)
            covidDeath.push(e.deaths)
            covidRecovered.push(e.recovered)
            covidProvince.push(e.region.province)
        });

    }

    let chartConfig = {
        type: 'bubble-pie',
        title: {
            text: 'Porcentaje de Covid-19 en España'
        },
        subtitle: {
            text: 'Basandonos en recuperados,fallecidos y casos confirmados'
        },
        legend: {
            align: 'center',
            item: {
            text: '%data-pie'
            },
            verticalAlign: 'bottom'
        },
        plot: {
        values: (covidConfirmado,covidRecovered,covidDeath),
        tooltip: {
        text: '%data-pv% %data-pie'
        },
        
        },
        scaleX: {
            values: covidProvince
        },
        series: [{
        dataPie: 'Casos confirmados',
        dataV: covidConfirmado,
        marker: {
            backgroundColor: '#5dc911'
        }
        },
        {
        dataPie: 'muertos',
        dataV: covidDeath,
        marker: {
            backgroundColor: '#e32143'
        }
        },
        {
        dataPie: 'recuperados',
        dataV: covidRecovered,
        marker: {
            backgroundColor: '#bfbfbf'
        }
        }
    ]
    };

    zingchart.render({
    id: 'myChart',
    data: chartConfig,
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