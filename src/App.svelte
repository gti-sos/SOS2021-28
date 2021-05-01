<script>
    import Router from 'svelte-spa-router';
	
	
	
    import Awards from './front/AwardsAPI/TableAwards.svelte';
    import AwardsPUT from './front/AwardsAPI/TableAwardsEdit.svelte'; 
	
	
	import PlatformsAPI from "./front/PlatformsAPI/PlatformsAPI.svelte";
	import EditPlatformsAPI from "./front/PlatformsAPI/EditPlatforms.svelte";
	
	
	
    import Home from './Pages/Home.svelte';
    import NotFound from './Pages/NotFound.svelte';
    import Info from './Pages/Info.svelte';
	
    const routes = {
        "/": Home,
		"/info":Info,
        "/awards": Awards,
        "/awards/:country/:year": AwardsPUT,
		"/platforms": PlatformsAPI,
		"/platfomrs/:country/:date": EditPlatformsAPI,
        "*": NotFound
        
        

    }
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