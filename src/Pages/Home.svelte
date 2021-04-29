<script>
  import {
    Button,
    Icon,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle,
    Col,
    Container,
    Row,
  } from "sveltestrap";
</script>

<main>
  <h1>SOS2021-28</h1>

  <h2>Team</h2>
  <Container>
    <Col>
      <a href="https://github.com/spartano27">José Manuel Martín de los Santos</a>
    </Col>
    <Col>
      <a href="https://github.com/MarinaBC">Marina Barragán Candel</a>
    </Col>
    <Col>
      <a href="https://github.com/Fernasilver">Fernando Olmedo Delgado</a>
    </Col>
  </Container>
  <p />
  <h2>Project description</h2>
  <p>
    Investigación y Analisis de las ventas de videojuegos y su relacion con la cantidad de consolas vendidas
	y los premios que haya obtenido dicho videojuego.
  </p>

  <Container>
    <Col>
      <a href="http://github.com/gti-sos/SOS2021-28"
        ><b>Repository: </b>http://github.com/gti-sos/SOS2021-01</a
      >
    </Col>
    <Col>
      <a href="http://sos2021-01.herokuapp.com"
        ><b>URL: </b>http://sos2021-01.herokuapp.com</a
      >
    </Col>
  </Container>
  <p />

  <a href="/#/info">
    <Button color="primary">Info</Button>
  </a>

  <p />

  <h2>APIs</h2>
  <Container>
    <Col xs="auto">
      <Card class="mb-3">
        <CardHeader>
          <CardTitle><h5>Awards</h5></CardTitle>
        </CardHeader>
        <CardBody>
          <CardSubtitle />
          
          <a href="https://sos2021-01.herokuapp.com/api/v1/awards">
            <Button color="primary">Backend</Button></a
          >
          <a href="/#/awards">
            <Button color="primary">Frontend</Button>
          </a>
          <a href="https://documenter.getpostman.com/view/14941757/TzJoE12q"
            ><Button color="info">Postman Documentation</Button></a
          >
        </CardBody>
        <CardFooter
          >developed by
          <a href="https://github.com/spartano27">José Manuel Martín de los Santos</a>
		  </CardFooter>
      </Card>
    </Col>
	
	
	
    <Col xs="auto">
      <Card class="mb-3">
        <CardHeader>
          <CardTitle><h5>Platforms</h5></CardTitle>
        </CardHeader>
        <CardBody>
          <CardSubtitle />
          
          <a href="https://sos2021-01.herokuapp.com/api/v1/platforms">
            <Button color="primary">Backend</Button>
          </a>
          <a href="/#/platforms">
            <Button color="primary">Frontend</Button>
          </a>
          <a href="hhttps://documenter.getpostman.com/view/14944973/TzJsexb1">
            <Button color="info">Postman Documentation</Button>
          </a>
        </CardBody>
        <CardFooter
          >developed by
          <a href="https://github.com/MarinaBC">Marina Barragán Candel</a>
        </CardFooter>
      </Card>
    </Col>
	
	
	
	
	
	
    <Col xs="auto">
      <Card class="mb-3">
        <CardHeader>
          <CardTitle><h5>Games</h5></CardTitle>
        </CardHeader>
        <CardBody>
          <CardSubtitle />
          <a href="/api/v1/games"
            ><Button color="primary">Backend</Button></a
          >
          <a href="/#/games"
            ><Button color="primary">Frontend</Button></a
          >
          <a href="https://documenter.getpostman.com/view/14967482/TzJu8cmV"
            ><Button color="info">Postman Documentation</Button></a
          >
        </CardBody>
        <CardFooter
          >developed by
          <a href="https://github.com/Fernasilver">Fernando Olmedo Delgado</a
          ></CardFooter
        >
      </Card>
    </Col>
  </Container>
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
  b {
    color: #00c1ff;
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>