import { faCar, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Card, CardBody, CardText, CardTitle, Col, Row } from "reactstrap";

const LoanOrHire: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <Row>
      <Col>
        <Card
        // onClick={() => history.push("/hire")}
        >
          <CardBody>
            <FontAwesomeIcon icon={faCar} size={"10x"} />
          </CardBody>
          <CardBody>
            <CardTitle>
              <h1>Hire</h1>
            </CardTitle>
            <CardText>Find a car that meets your needs</CardText>
          </CardBody>
        </Card>
      </Col>
      <Col>
        <Card onClick={(): void => history.push("/loan")}>
          <CardBody>
            <FontAwesomeIcon icon={faDollarSign} size={"10x"} />
          </CardBody>
          <CardBody>
            <CardTitle>
              <h1>Loan</h1>
            </CardTitle>
            <CardText>Loan your car to make money</CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default withRouter(LoanOrHire);
