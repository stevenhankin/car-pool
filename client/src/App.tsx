import Amplify from "aws-amplify";
import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Col, Container, Jumbotron, Row } from "reactstrap";
import "./App.css";
/**
 * Authenticate React with Amazon Web Services using Auth0
 * See https://auth0.com/authenticate/react/amazon/
 */
import awsconfig from "./aws-exports";
import Loan from "./components/Loan";
import RentOrHire from "./components/LoanOrHire";
import NavBar from "./components/NavBar";
import { useAuth0 } from "./auth/react-auth0-spa";

Amplify.configure(awsconfig);

const App: React.FC = () => {
  const [jwt, setJwt] = useState<string | undefined>(undefined);
  const { loading, user, getIdTokenClaims } = useAuth0();

  /**
   * Get a JWT from Auth0 SDK
   */
  if (!loading) {
    getIdTokenClaims().then((claims: IdToken) => {
      if (claims && claims.__raw) {
        setJwt(claims.__raw);
      }
    });
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Jumbotron>
              <Row className="float-right">
                <NavBar user={user} />
              </Row>
              <Row>
                <Col>
                  <h1 className="display-3">car pool</h1>
                  <h3 className="lead">
                    The marketplace for hiring and loaning cars
                  </h3>
                </Col>
              </Row>
            </Jumbotron>
          </Col>
        </Row>

        <Switch>
          <Route path="/" exact render={(): JSX.Element => <RentOrHire />} />
          {/* <Route path="/hire" render={(): JSX.Element => <Hire />} /> */}
          <Route path="/loan" render={(): JSX.Element => <Loan jwt={jwt} />} />
        </Switch>
      </Container>
    </>
  );
};

export default App;
