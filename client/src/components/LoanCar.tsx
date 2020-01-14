import React, { useState, useEffect } from "react";
import { Row, Col, Label, Input, Button, Spinner } from "reactstrap";
import { createCar } from "../api/car-pool-api";
import { Car } from "../types/Car";
import log from "../utils/Log";
import PropTypes from "prop-types";

interface Props {
  jwt: string;
  loanedCars: Car[];
  setLoanedCars: (arg: Car[]) => void;
}

const LoanCar: React.FC<Props> = ({ jwt, loanedCars, setLoanedCars }) => {
  // State of the Loan button:  Disabled <-> Idle -> Loaning -> Success|Failed
  enum LoanAction {
    Disabled = "Enter all fields",
    Idle = "Loan it!",
    Loaning = "Loaning... ",
    Failed = "Failed 🆇",
    Success = "Completed"
  }

  const [carMake, setCarMake] = useState<string | undefined>("");
  const [carModel, setCarModel] = useState<string | undefined>("");
  const [loanStatus, setLoanStatus] = useState<LoanAction>(LoanAction.Disabled);

  useEffect(() => {
    if (loanStatus === LoanAction.Idle || LoanAction.Disabled) {
      if (carMake && carModel) {
        setLoanStatus(LoanAction.Idle);
      } else {
        setLoanStatus(LoanAction.Disabled);
      }
    }
  }, [carMake, carModel, LoanAction.Idle, LoanAction.Disabled, loanStatus]);

  /**
   * User has requested to upload details of car
   * to loan to marketplace
   * @param e
   */
  const loanCar = async (): Promise<void> => {
    if (loanStatus === LoanAction.Idle) {
      if (jwt && carMake && carModel) {
        setLoanStatus(LoanAction.Loaning);
        try {
          const response = await createCar(jwt, {
            make: carMake,
            model: carModel
          });
          if (response.status < 299) {
            const car = response.data;
            log.info(`created car for loaning ${JSON.stringify(car)}`);
            // const uploadUrl = response.data.uploadUrl;
            // log.info(`upload URL is ${uploadUrl}`);
            setLoanedCars([...loanedCars, car]);
            // Temporarily set upload button to success
            // then blank out the Make and Model
            setLoanStatus(LoanAction.Success);
            setTimeout(() => {
              setCarMake("");
              setCarModel("");
            }, 1000);
          } else {
            setLoanStatus(LoanAction.Failed);
          }
        } catch (e) {
          log.error(JSON.stringify(e));
          setLoanStatus(LoanAction.Failed);
        }
      } else {
        log.info(
          "Can't loan car : Either jwt or make or model are not available"
        );
      }
    }
  };

  return (
    <>
      <Row>
        <Col>
          <h3>Loan a car</h3>
        </Col>
      </Row>

      <Row>
        <Col sm={1}>
          <Label for="make">Make</Label>
        </Col>
        <Col>
          <Input
            type="text"
            id="make"
            placeholder="e.g. Audi"
            value={carMake}
            onChange={(e): void => setCarMake(e.target.value)}
          />
        </Col>
        <Col sm={1}>
          <Label for="model">Model</Label>
        </Col>
        <Col>
          <Input
            type="text"
            id="model"
            placeholder="e.g. TT"
            value={carModel}
            onChange={(e): void => setCarModel(e.target.value)}
          />
        </Col>
        <Col>
          <Button
            color={"primary"}
            onClick={loanCar}
            disabled={!carMake || !carModel}
          >
            {loanStatus}{" "}
            {loanStatus === LoanAction.Loaning && (
              <Spinner style={{ height: "1.5rem", width: "1.5rem" }} />
            )}
          </Button>
        </Col>
      </Row>
    </>
  );
};

LoanCar.propTypes = {
  jwt: PropTypes.string.isRequired,
  loanedCars: PropTypes.arrayOf(
    PropTypes.shape({
      carId: PropTypes.string.isRequired,
      ownerId: PropTypes.string.isRequired,
      make: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      pictureUrl: PropTypes.string,
      nonce: PropTypes.string
    }).isRequired
  ).isRequired,
  setLoanedCars: PropTypes.func.isRequired
};

export default LoanCar;
