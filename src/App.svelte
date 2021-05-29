<script>
    import Router from 'svelte-spa-router';
	
    import Awards from './front/AwardsAPI/TableAwards.svelte';
    import AwardsPUT from './front/AwardsAPI/TableAwardsEdit.svelte'; 
	import AwardsChart from './front/AwardsAPI/AwardsCharts.svelte';
	import AwardsChart1 from './front/AwardsAPI/AwardsChart.svelte';
	import AwardsChart2 from './front/AwardsAPI/AwardsChart2.svelte';
	import PlatformsAPI from "./front/PlatformsAPI/PlatformsAPI.svelte";
	import EditPlatformsAPI from "./front/PlatformsAPI/EditPlatforms.svelte";
	import PlatformCharts from "./front/PlatformsAPI/PlatformsChart.svelte";


	import GamesAPI from "./front/GamesAPI/GamesAPI.svelte";
	import EditGames from "./front/GamesAPI/EditGames.svelte";
	import GamesCharts from "./front/GamesAPI/GamesChart.svelte";
	
	
	import Integraciones from "./front/Integrations/Integrations.svelte";
	
	import IntegrationApiMonedasExterna from "./front/Integrations/Platforms-Integrations/ApiMonedas.svelte";
	import IntegrationApiSuicidiosExterna from "./front/Integrations/Platforms-Integrations/ApiSuicidios.svelte";
	import IntegrationApiArmasExterna from "./front/Integrations/Platforms-Integrations/ApiArmas.svelte";
	import IntegrationApiHomicidioExterna from "./front/Integrations/Platforms-Integrations/ApiHomicidios.svelte";
	import IntegrationApiSeriesExterna from "./front/Integrations/Platforms-Integrations/ApiSerie.svelte";

	import IntegrationApiGrammys from "./front/Integrations/Awards-Integrations/ApiGrammys.svelte";
	import IntegrationApiPromotion from "./front/Integrations/Awards-Integrations/ApiPromotion.svelte";


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
		"/awards/awardsCharts": AwardsChart,
		"/awards/awardsChart": AwardsChart1,
		"/awards/awardsChart2": AwardsChart2,
		"/games": GamesAPI,
		"/games/:country/:year": EditGames,
		"/games/gamesCharts": GamesCharts,
		"/integrations": Integraciones,
		"/integrations/monedas-externalApi":IntegrationApiMonedasExterna,
		"/integrations/suicidios-externalApi":IntegrationApiSuicidiosExterna,
		"/integrations/armas-externalApi":IntegrationApiArmasExterna,
		"/integrations/homicidio-externalApi":IntegrationApiHomicidioExterna,
		"/integrations/series-externalApi":IntegrationApiSeriesExterna,
		"/integrations/grammysApi":IntegrationApiGrammys,
		"/integrations/promotionApi":IntegrationApiPromotion,
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