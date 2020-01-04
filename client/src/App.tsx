import Amplify from 'aws-amplify';
import React from 'react';
import { RouteComponentProps, withRouter } from "react-router";
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { Col, Container, Jumbotron, Row } from 'reactstrap';
// import logo from './logo.svg';
import './App.css';
import awsconfig from './aws-exports';
import RentOrHire from './components/LoanOrHire';
import Loan from './components/Loan'
import Hire from './components/Hire'
import logo from './assets/logo.png'

Amplify.configure(awsconfig);

const App: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <Container >
      <Row>
        <Col>
          <Jumbotron>
            <Row>
              <Col>
                <h1 className="display-3">car pool</h1>
                <h3 className="lead">The marketplace for hiring and loaning cars</h3>
              </Col>
            </Row>
          </Jumbotron>
        </Col>
      </Row>

      <Switch>
        <Route path="/" exact render={() => <RentOrHire />} />
        <Route path="/hire" render={() => <Hire />} />
        <Route path="/loan" render={() => <Loan />} />
      </Switch>

    </Container>
  );
}


const signUpConfig = {
  header: 'My Customized Sign Up',
  hideAllDefaults: true,
  defaultCountryCode: '44',
  signUpFields: [
    {
      label: 'My custom email label',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string'
    },
  ]
};

export default withRouter(App);
// export default withAuthenticator(App, true, undefined,undefined,undefined,{ signUpConfig });
