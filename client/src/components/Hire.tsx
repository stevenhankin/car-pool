import React from 'react';
import { Button, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, CardGroup, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

const Hire: React.FC<RouteComponentProps> = ({ history }) => {

    return (
        <Row>
            <Col>
               <h1>Hire</h1>
            </Col>
            
        </Row>
    )
}


export default withRouter(Hire);