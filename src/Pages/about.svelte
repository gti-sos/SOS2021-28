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

      
    <h1> Videos</h1>
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
              <CardTitle><h5>Video de la API Premios</h5></CardTitle>
            </CardHeader>
            <CardBody>
              <CardSubtitle />
              
              <a href="video">
                <Button color="primary">Video</Button></a>
              
            </CardBody>
            
          </Card>
        </Col>
        
        
        
        
        
        <Col xs="auto">
          <Card class="mb-3">
            <CardHeader>
              <CardTitle><h5>Video de la API plataformas</h5></CardTitle>
            </CardHeader>
            <CardBody>
              <CardSubtitle />
             
              <a href="https://www.youtube.com/watch?v=r1Kt_G5gAZA&ab_channel=MarinaB">
                <Button color="primary">Video</Button>
              </a>
              
              
            </CardBody>
            
          </Card>
        </Col>
        
        
        
        
        
        <Col xs="auto">
          <Card class="mb-3">
            <CardHeader>
              <CardTitle><h5>Videos de la API Juegos</h5></CardTitle>
            </CardHeader>
            <CardBody>
              <CardSubtitle />
              
              <a href="video">
                <Button color="primary">Video</Button></a>
              
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