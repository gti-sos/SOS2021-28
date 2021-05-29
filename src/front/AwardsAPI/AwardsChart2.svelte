<script>

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
            countryWinnerData.push(stat.winner);
            //platChartData.push(stat.platform);
            galaData.push(stat.gala)
            yearData.push(stat.year);
            nPlatformData.push(stat["n-platform"]);
            nAwardData.push(stat["n-award"]);
            
            });
        }

                var myConfig = {
                    type: 'bar',
                    'legend':{},
                    'scale-x': {
                        labels: countryWinnerData
                    },
                    series: [
                        { text : "Numero de plataformas",
                        values: nPlatformData
                        },
                        { text : "Numero de premios",
                        values: nAwardData
                        }
                    ]
                    };

                    
        zingchart.render({
            id: 'myChart',
            data: myConfig,
            
        });

}
    
</script>


<svelte:head>

  <script
    src="https://cdn.zingchart.com/zingchart.min.js"
    on:load={loadChart}></script>
</svelte:head>
<main>
    <h1> Grafica de la API Awards </h1>
    <div id="myChart"></div>
</main>