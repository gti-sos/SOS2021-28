<script>
	import TableGames from './TableGames.svelte'
	export let name;

</script>

<main>
	<h1>Hello {name}!</h1>
	<!--
		<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
		
	-->
	<a href="oldindex.html">Antiguo index</a>
	<br>
	<input type="button" value="Games" onClick="document.getElementById('oculto').style.visibility='visible'">
	<input type="button" value="Ocultar" onClick="document.getElementById('oculto').style.visibility='hidden'">
	
	<div id="oculto" style="visibility:hidden">
		<TableGames/>
	</div>
	
	
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