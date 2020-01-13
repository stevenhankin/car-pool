import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Col, Row } from "reactstrap";

const Hire: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <Row>
      <Col>
        <h1>Hire</h1>
      </Col>
    </Row>
  );
};

export default withRouter(Hire);
