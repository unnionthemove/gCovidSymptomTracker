import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home";
import About from "./components/About";
import Tracker from "./components/Tracker";
import Update from "./components/Update";
import { Row, Col, Navbar, Container, Nav } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h4>Covid-19 Symptom Tracker</h4>
        </div>
        <BrowserRouter>

          <div>
            <Container fluid>
              <Row>
                <Col>
                  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href="/"> Home</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                      <Nav className="mr-auto">
                        <Nav.Link href="/tracker">Track</Nav.Link>
                        <Nav.Link href="/update">Update</Nav.Link>
                      </Nav>
                      <Nav>
                        <Nav.Link href="/about">
                          About
      </Nav.Link>
                      </Nav>
                    </Navbar.Collapse>
                  </Navbar>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Route path="/" exact component={Home} />
                  <Route path="/about" exact component={About} />
                  <Route path="/tracker" exact component={Tracker} />
                  <Route path="/update" exact component={Update} />
                </Col>
              </Row>
              <Row>
              <Col>

<footer class="page-footer font-small blue pt-4">


  <div class="container-fluid text-center text-md-left">

      <div class="col-md-6 mt-md-0 mt-3">


        <p>Covid Symptom tracker project is a personal project and I am doing this to contribute to the global visibility of the ongoing pandemic in what ever way I can.</p>
        <p>If people are truthful and can anonymously report their symptoms through this app, the volunteers in the frontline will have invaluable information.</p>
        <p>In case you want to contribute to the development or if you find issues with the app <a href="mailto:gcovidtracker@gmail.com">Email me</a></p>

        <h5>Help me maintain this application!!</h5>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick" />
<input type="hidden" name="hosted_button_id" value="3SXRKP2MYXGAJ" />
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
<img alt="" border="0" src="https://www.paypal.com/en_FI/i/scr/pixel.gif" width="1" height="1" />
</form>

      </div>

      <a href="https://twitter.com/Unnionthemove?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @Unnionthemove</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </div>
  <div class="footer-copyright text-center py-3">© 2020 Copyright:
    <a href="https://unnionthemove.com/"> UnniOnTheMove.com</a>
  </div>
</footer>

              </Col>
              </Row>

            </Container>

          </div>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;
