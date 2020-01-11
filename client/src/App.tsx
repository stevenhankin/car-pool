import Amplify from "aws-amplify";
import React, { useState } from "react";
import { withAuthenticator } from "aws-amplify-react";
import { RouteComponentProps, withRouter } from "react-router";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { Col, Container, Jumbotron, Row } from "reactstrap";
// import logo from './logo.svg';
import "./App.css";
import awsconfig from "./aws-exports";
import RentOrHire from "./components/LoanOrHire";
import Loan from "./components/Loan";
import Hire from "./components/Hire";
// import logo from './assets/logo.png';
import NavBar from "./components/NavBar";

/**
 * Authenticate React with Amazon Web Services using Auth0
 * See https://auth0.com/authenticate/react/amazon/
 */
import Auth from "./auth/Auth";
import { useAuth0 } from "./react-auth0-spa";

Amplify.configure(awsconfig);

export interface AppProps {
  auth: Auth | undefined;
  history: any;
}

const App: React.FC<AppProps> = ({ history, auth }) => {
  const [jwt, setJwt] = useState<string | undefined>(undefined);

  const { loading, user, token, getIdTokenClaims } = useAuth0();

  console.log("!!!! token", token);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  /**
   * Get a JWT from Auth0 SDK
   */
  if (!loading) {
    let claims = getIdTokenClaims().then((claims: IdToken) => {
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
          <Route path="/" exact render={() => <RentOrHire />} />
          <Route path="/hire" render={() => <Hire />} />
          <Route path="/loan" render={() => <Loan jwt={jwt} />} />
        </Switch>
      </Container>
    </>
  );
};

const signUpConfig = {
  header: "My Customized Sign Up",
  hideAllDefaults: true,
  defaultCountryCode: "44",
  signUpFields: [
    {
      label: "My custom email label",
      key: "email",
      required: true,
      displayOrder: 1,
      type: "string"
    }
  ]
};

export default App;
// export default withRouter(App);
// export default withAuthenticator(App, true, undefined,undefined,undefined,{ signUpConfig });
