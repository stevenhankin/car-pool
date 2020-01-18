/**
 * Display Modal dialog for editing the make and model of a car
 * and updating the details in the DynamoDB
 */
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Row,
  Col,
  Container
} from "reactstrap";
import log from "../utils/Log";
import { Car } from "../types/Car";
import { updateCar } from "../api/car-pool-api";
import uuid from "uuid";

export interface Props {
  jwt: string | undefined;
  loanedCars: Car[];
  setLoanedCars: (arg: Car[]) => void;
  modal: boolean;
  setModal: (arg: boolean) => void;
  currentCar: Car;
  getCarsForUser: (jwt: string) => void;
}

const EditCarDetails: React.FC<Props> = ({
  jwt,
  loanedCars,
  setLoanedCars,
  modal,
  setModal,
  currentCar,
  getCarsForUser
}) => {
  const [make, setMake] = useState(currentCar.make);
  const [model, setModel] = useState(currentCar.model);

  const toggle = (): void => setModal(!modal);

  /**
   * Update the car make and model on DynamoDB
   */
  const updateDetails = async (): Promise<void> => {
    log.info("Updating car");
    if (jwt) {
      const response = await updateCar(jwt, currentCar.carId, make, model);
      log.info(JSON.stringify(response));
      if (response.status < 299) {
        // On successful change, close modal and refresh
        setModal(false);
        const cars = [...loanedCars];
        const carToUpdate = cars.filter(
          car => car.carId === currentCar.carId
        )[0];
        carToUpdate.nonce = uuid();
        carToUpdate.make = make;
        carToUpdate.model = model;
        setLoanedCars(cars);
        getCarsForUser(jwt);
      }
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Car Details</ModalHeader>
      <ModalBody>
        <Container>
          <Row>
            <Col sm={2}>
              <Label htmlFor="make">Make</Label>
            </Col>
            <Col>
              <Input
                id="make"
                type="text"
                value={make}
                onChange={(e): void => setMake(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={2}>
              <Label htmlFor="model">Model</Label>
            </Col>
            <Col>
              <Input
                id="model"
                type="text"
                value={model}
                onChange={(e): void => setModel(e.target.value)}
              />
            </Col>
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={updateDetails}
          disabled={!make || !model}
        >
          Update
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

EditCarDetails.propTypes = {
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
  setLoanedCars: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  setModal: PropTypes.func.isRequired,
  currentCar: PropTypes.shape({
    carId: PropTypes.string.isRequired,
    ownerId: PropTypes.string.isRequired,
    make: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    pictureUrl: PropTypes.string,
    nonce: PropTypes.string
  }).isRequired,
  getCarsForUser: PropTypes.func.isRequired
};

export default EditCarDetails;
