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
          <NavLink href="#/awards">Volver</NavLink>
        </NavItem>
      </Nav>

      
    <h1> Graficas</h1>
    <Container>
        <Row>
          <Col>
            
          </Col>
        </Row>
      </Container>
      <p />
      <Container>
        <Col xs="auto">
          <Card class="mb-3">
            <CardHeader>
              <CardTitle><h5>Grafica mediante biblioteca Higchart</h5></CardTitle>
            </CardHeader>
            <CardBody>
              <CardSubtitle />
              
              <a href="#/awards/awardsChart">
                <Button color="primary">Grafica</Button></a>
              
            </CardBody>
            
          </Card>
        </Col>
       
        

        <Col xs="auto">
          <Card class="mb-3">
            <CardHeader>
              <CardTitle><h5>Grafica mediante biblioteca Higchart</h5></CardTitle>
            </CardHeader>
            <CardBody>
              <CardSubtitle />
              
              <a href="#/awards/awardsChart">
                <Button color="primary">Grafica</Button></a>
              
            </CardBody>
            
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