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
    Nav,
    NavItem,
    NavLink,
    Row,
  } from "sveltestrap";
</script>




<main>
  <Nav>
    <NavItem>
      <NavLink href="/">Volver</NavLink>
    </NavItem>
  </Nav>




  <h1>SOS2021-28</h1>

  <h2>Equipo</h2>
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
  <Container>
    <Row>
      <Col>
        <a href="http://github.com/gti-sos/SOS2021-28">
          <Button color="primary">GitHub</Button></a>
      </Col>
    </Row>
  </Container>
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
          
          <a href="https://sos2021-28.herokuapp.com/api/v1/awards">
            <Button color="primary">API</Button></a>
          <a href="/#/awards">
            <Button color="primary">Interfaz</Button>
          </a>
		  
          <a href="https://documenter.getpostman.com/view/14941757/TzJoE12q">
		  <Button color="info">Documentacion de Postman</Button></a>
        </CardBody>
        <CardFooter>
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
         
          <a href="https://sos2021-28.herokuapp.com/api/v1/platforms">
            <Button color="primary">API</Button>
          </a>
          <a href="/#/pltforms">
            <Button color="primary">Interfaz</Button>
          </a>
          <a href="https://documenter.getpostman.com/view/14944973/TzJsexb1">
            <Button color="info">Documentacion de Postman</Button>
          </a>
        </CardBody>
        <CardFooter>
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
          
          <a href="https://sos2021-28.herokuapp.com/api/v1/games">
            <Button color="primary">API</Button></a>
          <a href="/#/games">
		  <Button color="primary">Interfaz</Button></a>
          <a href="https://documenter.getpostman.com/view/14967482/TzJu8cmV">
		  <Button color="info">Documentacion de Postman</Button></a>
        </CardBody>
        <CardFooter>
          <a href="https://github.com/Fernasilver">Fernando Olmedo Delgado</a>
		</CardFooter>
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
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>