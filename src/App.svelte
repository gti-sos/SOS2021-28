<script>
    import Router from 'svelte-spa-router';
	
    import Awards from './front/AwardsAPI/TableAwards.svelte';
    import AwardsPUT from './front/AwardsAPI/TableAwardsEdit.svelte'; 
	import AwardsChart from './front/AwardsAPI/AwardsCharts.svelte';
	import AwardsChart1 from './front/AwardsAPI/AwardsChart.svelte';
	import AwardsChart2 from './front/AwardsAPI/AwardsChart2.svelte';
	import Awardsd3js from './front/AwardsAPI/AwardsChartD3js.svelte'
	import PlatformsAPI from "./front/PlatformsAPI/PlatformsAPI.svelte";
	import EditPlatformsAPI from "./front/PlatformsAPI/EditPlatforms.svelte";
	import PlatformCharts from "./front/PlatformsAPI/PlatformsChart.svelte";
	import PlatformCharts2 from "./front/PlatformsAPI/PlatformsChart2.svelte";


	import GamesAPI from "./front/GamesAPI/GamesAPI.svelte";
	import EditGames from "./front/GamesAPI/EditGames.svelte";
	import GamesCharts from "./front/GamesAPI/GamesChart.svelte";
	import GamesCharts2 from "./front/GamesAPI/GamesChart2.svelte";
	
	
	import Integraciones from "./front/Integrations/Integrations.svelte";
	
	import IntegrationApiMonedasExterna from "./front/Integrations/Platforms-Integrations/ApiMonedas.svelte";
	import IntegrationApiSuicidiosExterna from "./front/Integrations/Platforms-Integrations/ApiSuicidios.svelte";
	import IntegrationApiArmasExterna from "./front/Integrations/Platforms-Integrations/ApiArmas.svelte";
	import IntegrationApiHomicidioExterna from "./front/Integrations/Platforms-Integrations/ApiHomicidios.svelte";
	import IntegrationApiSeriesExterna from "./front/Integrations/Platforms-Integrations/ApiSerie.svelte";
	import IntegrationApiLifeExterna from "./front/Integrations/Platforms-Integrations/ApiLife.svelte";
	import IntegrationApiPrincesaExterna from "./front/Integrations/Platforms-Integrations/ApiPrincesa.svelte";


	import IntegrationApiGrammys from "./front/Integrations/Awards-Integrations/ApiGrammys.svelte";
	import IntegrationApiPromotion from "./front/Integrations/Awards-Integrations/ApiPromotion.svelte";
	import IntegrationApiFreeGames from "./front/Integrations/Awards-Integrations/ApiFreeGames.svelte";
	import IntegrationApiExterna from "./front/Integrations/Awards-Integrations/ApiExterna.svelte";


	import IntegrationApiPoverty from "./front/Integrations/Games-Integrations/ApiPoverty.svelte";
	import IntegrationApiAzar from "./front/Integrations/Games-Integrations/ApiAzar.svelte";
	import IntegrationApiPopulationExterna from "./front/Integrations/Games-Integrations/ApiPopulation.svelte";
	import IntegrationApiCountryExterna from "./front/Integrations/Games-Integrations/ApiCountry.svelte";
	

    import Home from './Pages/Home.svelte';
    import NotFound from './Pages/NotFound.svelte';
    import Info from './Pages/Info.svelte';
	import GeneralChart from './Pages/Analytics.svelte';
	import About from './Pages/about.svelte'; 
	
    const routes = {
        "/": Home,
		"/info":Info,
		"/Analytics":GeneralChart,
		
        "/awards": Awards,
        "/awards/:country/:year": AwardsPUT,
		"/platforms": PlatformsAPI,
		"/platforms/:country/:year": EditPlatformsAPI,
		"/platforms/platformCharts": PlatformCharts,
		"/platforms/platformCharts2": PlatformCharts2,
		"/awards/awardsCharts": AwardsChart,
		"/awards/awardsChart": AwardsChart1,
		"/awards/awardsChart2": AwardsChart2,
		"/awards/awardsD3js": Awardsd3js,
		"/games": GamesAPI,
		"/games/:country/:year": EditGames,
		"/games/gamesCharts": GamesCharts,
		"/games/gamesCharts2": GamesCharts2,
		"/integrations": Integraciones,
		"/integrations/monedas-externalApi":IntegrationApiMonedasExterna,
		"/integrations/suicidios-externalApi":IntegrationApiSuicidiosExterna,
		"/integrations/armas-externalApi":IntegrationApiArmasExterna,
		"/integrations/homicidio-externalApi":IntegrationApiHomicidioExterna,
		"/integrations/series-externalApi":IntegrationApiSeriesExterna,
		"/integrations/life-externalApi":IntegrationApiLifeExterna,
		"/integrations/premios-externalApi":IntegrationApiPrincesaExterna,
		"/integrations/population-externalApi":IntegrationApiPopulationExterna,
		"/integrations/country-externalApi":IntegrationApiCountryExterna,
		"/integrations/grammysApi":IntegrationApiGrammys,
		"/integrations/promotionApi":IntegrationApiPromotion,
		"/integrations/freeGamesApi":IntegrationApiFreeGames,
		"/integrations/externaApi":IntegrationApiExterna,
		"/integrations/povertyApi":IntegrationApiPoverty,
		"/integrations/azarApi":IntegrationApiAzar,
		"/about":About,
        "*": NotFound 
	};
</script>

<main>

    <Router {routes}/>

	
	
</main>



	
	
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>