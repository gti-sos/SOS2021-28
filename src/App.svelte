<script>
	import TableGames from './TableGames.svelte';
	import TablePlatforms from './TablePlatforms.svelte';
	export let name;

</script>

<main>
	<h1> SOS2021-28</h1>
	<!--
		<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
		
		<a href="oldindex.html">Antiguo index</a>
	-->
	
	
	
	
	
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SOS2021-28</title>
</head>
<body>
    
    <ul>
        <li>
            <b>Team</b>
            <ul>
                <li><a href="https://github.com/spartano27">José Manuel Martín de los Santos</a></li>
                <li><a href="https://github.com/MarinaBC">Marina Barragán Candel</a></li>
                <li><a href="https://github.com/Fernasilver">Fernando Olmedo Delgado</a></li>
            </ul>
        </li>
        <li>
            <b>Project description: </b> Investigación y Analisis de las ventas de videojuegos y su relacion con la cantidad de consolas vendidas y los premios que haya obtenido dicho videojuego.
        </li>
        <li>
            <b>Repository:</b> <a href="https://github.com/gti-sos/SOS2021-28">http://github.com/gti-sos/SOS2021-28</a>
        </li>
        <li>
            <b>URL</b>: <a href="http://sos2021-28.herokuapp.com">http://sos2021-28.herokuapp.com</a>
        </li>
        <li>
            <b>APIs:</b>
            <ul>
                <li>
                    <a href="https://sos2021-28.herokuapp.com/api/v1/awards">https://sos2021-28.herokuapp.com/api/v1/awards</a> 
                    (developed by <a href="https://github.com/spartano27">José Manuel Martín de los Santos</a>)
                </li>
                <li>
                    <a href="https://sos2021-28.herokuapp.com/api/v1/platforms">https://sos2021-28.herokuapp.com/api/v1/platforms</a> 
                    (developed by <a href="https://github.com/MarinaBC">Marina Barragán Candel</a>)
                </li>
                <li>
                    <a href="https://sos2021-28.herokuapp.com/api/v1/games">https://sos2021-28.herokuapp.com/api/v1/games</a> 
                    (developed by <a href="https://github.com/Fernasilver">Fernando Olmedo Delgado</a>)
                </li>
            </ul>
            <b>Postman documentation:</b>
            <ul>
                <li>
                    <a href="https://documenter.getpostman.com/view/14941757/TzJoE12q">postman sobre awards</a> 
                    (developed by <a href="https://github.com/spartano27">José Manuel Martín de los Santos</a>)

                </li>
                
                <li>
                    <a href="https://documenter.getpostman.com/view/14944973/TzJsexb1">postman sobre platforms</a> 
                    (developed by <a href="https://github.com/MarinaBC">Marina Barragán Candel</a>)

                </li>
				
				<li>
                    <a href="https://documenter.getpostman.com/view/14967482/TzJu8cmV">postman sobre games</a> 
                    (developed by <a href="https://github.com/Fernasilver">Fernando Olmedo Delgado</a>)

                </li>

            </ul>
        </li>
    </ul>


</body>


	
	<h1>Front-end</h1>
	
	
	
	
	
	
	
	<input type="button" value="Games" onClick="document.getElementById('oculto').style.visibility='visible'">
	<input type="button" value="Ocultar" onClick="document.getElementById('oculto').style.visibility='hidden'">
	
	<div id="oculto" style="visibility:hidden">
		<TableGames/>
	</div>
	
	
	<h1></h1>
	<br>
	<input type="button" value="Platforms" onClick="document.getElementById('noculto').style.visibility='visible'">
	<input type="button" value="Ocultar" onClick="document.getElementById('noculto').style.visibility='hidden'">
	
	<div id="noculto" style="visibility:hidden">
		<TablePlatforms/>
	</div>
    <h1></h1>
	
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