import PropTypes from "prop-types";
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { Car } from "../types/Car";
import ListLoanedCars from "./ListLoanedCars";
import LoanCar from "./LoanCar";

export interface Props {
  jwt: string | undefined;
}

/**
 * {user} is the authenticated user's JWT
 */
const Loan: React.FC<Props> = ({ jwt }) => {
  const [loanedCars, setLoanedCars] = useState<Car[]>([]);

  return !jwt ? (
    <Row>
      <Col>Please login (see login button at top-right)</Col>
    </Row>
  ) : (
    <Row>
      <Col>
        <LoanCar
          jwt={jwt}
          loanedCars={loanedCars}
          setLoanedCars={setLoanedCars}
        />

        <ListLoanedCars
          jwt={jwt}
          loanedCars={loanedCars}
          setLoanedCars={setLoanedCars}
        />
      </Col>
    </Row>
  );
};

Loan.propTypes = {
  jwt: PropTypes.string
};

export default Loan;
