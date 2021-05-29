<script>
    import Button from "sveltestrap/src/Button.svelte";
    async function loadGraph() {
        //OK
        const resDataSerie = await fetch("https://jikan1.p.rapidapi.com/top/anime/1/upcoming", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "jikan1.p.rapidapi.com",
                "x-rapidapi-key": "7bc52e4b37msh757136e9b4c40b4p19bc8bjsn5cf2bde828bc"
            }
        })
        
        let serie = await resDataSerie.json();
        console.log(serie);
        let SerieApi = serie.top;
        console.log(SerieApi);
        let dataSerie = SerieApi.map((d) => {
            let res = {
                name: d.title,
                value: d["rank"]
            };
            return res;
        });
        console.log(dataSerie);
        let dataTotal =
            [
                {
                    name: "Serie",
                    data: dataSerie
                }
            ];
        Highcharts.chart('container1', {
            chart: {
                type: 'packedbubble',
                height: '100%'
            },
            title: {
                text: 'Series anime'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                    minSize: '30%',
                    maxSize: '60%',
                    zMin: 0,
                    zMax: 1000,
                    layoutAlgorithm: {
                        splitSeries: false,
                        gravitationalConstant: 0.02
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                        filter: {
                            property: 'y',
                            operator: '>',
                            value: 250
                        },
                        style: {
                            color: 'black',
                            textOutline: 'none',
                            fontWeight: 'normal'
                        }
                    }
                }
            },
            series: dataTotal
        });
    }
</script>

<svelte:head>

    <script src="https://code.highcharts.com/highcharts.js" ></script>
    <script src="https://code.highcharts.com/highcharts-more.js" ></script>
    <script src="https://code.highcharts.com/modules/exporting.js" ></script>
    <script src="https://code.highcharts.com/highcharts.src.js" ></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load={loadGraph}></script>

</svelte:head>

<main>

    <figure class="highcharts-figure">
        <div id="container1"></div>
    </figure>

</main>