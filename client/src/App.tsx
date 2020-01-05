import Amplify from 'aws-amplify';
import React from 'react';
import { withAuthenticator } from 'aws-amplify-react';
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
import NavBar from './components/NavBar'


/**
 * Authenticate React with Amazon Web Services using Auth0 
 * See https://auth0.com/authenticate/react/amazon/
 */
import Auth from './auth/Auth'
import { useAuth0 } from './react-auth0-spa';

Amplify.configure(awsconfig);

export interface AppProps {
  auth: Auth
  history: any
}

const App: React.FC<AppProps> = ({ history, auth }) => {

  const { loading, user } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }




  return (
    <>
    <NavBar/>
    <Container >
      <Row>
        {user && (<> <img src={user.picture} alt="Profile" />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <code>{JSON.stringify(user, null, 2)}</code></>)
        }

      </Row>
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
    </>
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

export default App;
// export default withRouter(App);
// export default withAuthenticator(App, true, undefined,undefined,undefined,{ signUpConfig });
