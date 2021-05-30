<script>

    async function loadGraph(){

    const BASE_CONTACT_API_PATH = "/api/v1";
    let pData = [];
    let WinnerData = [];
    let awardData = [];
    let yearData = [];
    let galaData = [];
    let nPlatformData = [];
    let nAwardData = [];
    let juegos = []
    let juegosData = []
    let wData = []
    let juegosmenos = []
    let juegosNombre = []
    const res = await fetch(BASE_CONTACT_API_PATH + "/awards");
        pData = await res.json();
        if (res.ok) {
            pData.forEach(stat => {
            WinnerData.push({text:stat.winner,values:[stat["n-platform"]]});
            //platChartData.push(stat.platform);
            galaData.push(stat.gala)
            yearData.push(stat.year);
            nPlatformData.push(stat["n-platform"]);
            nAwardData.push(stat["n-award"]);
            wData.push(stat.winner);
            
            });
        }


    const data = await fetch("https://gamerpower.p.rapidapi.com/api/giveaways", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "b84f6dbfd4msh9315e750631492ap131205jsnea9924bbe540",
		"x-rapidapi-host": "gamerpower.p.rapidapi.com"
	}
    });
    if(data.ok){
        juegos = await data.json();
        console.log(juegos)
        juegos.forEach(e => {

            juegosData.push({text:e.title,values:[((e.platforms).split(",")).length]})
            juegosNombre.push(e.title)
            
        });

        juegosData.forEach((e,i) =>{
            if(i<=13){
                juegosmenos.push(parseInt(e.values))
            }
        });

        console.log(juegosmenos)
        
    }

    var myConfig = {
        
            type: 'pop-pyramid',
            globals: {
            fontSize: '14px'
            },
            title: {
            text: 'Numero de plataformas de juegos premiados o gratuitos',
            fontSize: '24px'
            },
            options: {
            // values can be: 'bar', 'hbar', 'area', 'varea', 'line', 'vline'
            aspect: 'hbar'
            },
            legend: {
            shared: true
            },
            // plot represents general series, or plots, styling
            plot: {
            // hoverstate
            tooltip: {
                padding: '10px 15px',
                borderRadius: '3px'
            },
            valueBox: {
                color: '#fff',
                placement: 'top-in',
                thousandsSeparator: ','
            },
            // animation docs here:
            // https://www.zingchart.com/docs/tutorials/design-and-styling/chart-animation/#animation__effect
            animation: {
                effect: 'ANIMATION_EXPAND_BOTTOM',
                method: 'ANIMATION_STRONG_EASE_OUT',
                sequence: 'ANIMATION_BY_NODE',
                speed: 222
            }
            },
            scaleX: {
            // set scale label
            "short": true,
            visible: false
            },
            scaleY: {
            // scale label with unicode character
            label: {
                text: 'numero de plataformas'
            }
            },
                    
            series:[{
                text: "Juegos premiados",
                values: nPlatformData,
                // two colors with a space makes a gradient
                backgroundColor: '#94090D',
                dataSide: 1
            },{
                text: "Juegos gratuitos",
                values: juegosmenos,

                // two colors with a space makes a gradient
                backgroundColor: '#2682b2',
                dataSide: 2
            }]
      
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
    on:load={loadGraph}></script>
</svelte:head>


<main>
    <h1> Grafica de la API Awards </h1>
    <div id="myChart"></div>
</main>