import {
  faPencilAlt,
  faTrash,
  faUserInjured
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
// import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table
} from "reactstrap";
import {
  createCar,
  deleteCar,
  getPhotoUploadUrl,
  getUserCars,
  putPhoto
} from "../api/car-pool-api";
import { Car } from "../types/Car";
// import { LogIn } from './LogIn';
import log from "../utils/Log";

export interface Props {
  jwt: string | undefined;
}

/**
 * {user} is the authenticated user's JWT
 */
const Loan: React.FC<Props> = ({ jwt }) => {
  // State of the Loan button:  Disabled <-> Idle -> Loaning -> Success|Failed
  enum LoanAction {
    Disabled = "Enter fields above",
    Idle = "Loan it!",
    Loaning = "Loaning... ",
    Failed = "Failed 🆇",
    Success = "Completed"
  }

  const [carMake, setCarMake] = useState<string | undefined>("");
  const [carModel, setCarModel] = useState<string | undefined>("");
  const [picture, setPicture] = useState<File | undefined>(undefined);
  const [loanStatus, setLoanStatus] = useState<LoanAction>(LoanAction.Disabled);
  const [loanedCars, setLoanedCars] = useState<Car[]>([]);
  const [modal, setModal] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | undefined>(undefined);
  const [editCarId, setEditCarId] = useState<string | undefined>(undefined);

  const toggle = (): void => setModal(!modal);

  useEffect(() => {
    log.debug(`picture changed ${JSON.stringify(picture)}`);
  }, [picture]);

  /**
   * List of all cars for user
   * @param jwt
   */
  const getCarsForUser = async (jwt: string): Promise<void> => {
    log.info("Calling API to get loaned cars for user");
    try {
      const response = await getUserCars(jwt);
      const cars = response.data.map(car => ({ ...car, nonce: uuid() }));
      setLoanedCars(cars);
      log.info(`${JSON.stringify(response)}`);
    } catch (e) {
      log.error(JSON.stringify(e));
    }
  };

  /**
   * Login will trigger getting list of cars
   */
  useEffect(() => {
    if (jwt) {
      getCarsForUser(jwt);
    }
  }, [jwt]);

  /**
   * User has selected a picture to upload
   * @param e
   */
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      log.debug(`JJJ ${JSON.stringify(file.name)}`);
      setPicture(file);
    }
  };

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

  /**
   * User has clicked icon to edit the photo
   * @param carId
   */
  const handleEditPhoto = async (carId: string): Promise<void> => {
    log.info(carId);
    if (jwt) {
      try {
        const response = await getPhotoUploadUrl(jwt, carId);
        log.info(JSON.stringify(response));
        if (response.status < 299) {
          log.info("success");
          setSignedUrl(response.data.uploadUrl);
          setEditCarId(carId);
          setModal(true);
        }
      } catch (e) {
        log.error("failed");
      }
    }
  };

  /**
   * Delete a car (so it is no longer loaned)
   * @param carId
   */
  const handleDelete = async (carId: string): Promise<void> => {
    log.info(carId);
    if (jwt) {
      try {
        const response = await deleteCar(jwt, carId);
        log.info(JSON.stringify(response));
        if (response.status < 299) {
          // Remove from displayed list
          setLoanedCars(loanedCars.filter(c => c.carId !== carId));
        }
      } catch (e) {
        log.error("failed");
      }
    }
  };

  /**
   *
   */
  const uploadPhoto = async (): Promise<void> => {
    if (signedUrl && jwt && picture) {
      log.info(`About to upload ${picture.name}`);
      const response = await putPhoto(signedUrl, picture);
      log.info(response);
      if (response.status < 299) {
        // On successful upload, close modal and refresh
        setModal(false);
        const cars = [...loanedCars];
        cars.filter(car => car.carId == editCarId)[0].nonce = uuid();
        setLoanedCars(cars);
        getCarsForUser(jwt);
      }
    }
  };

  useEffect(() => {
    if (loanStatus === LoanAction.Idle || LoanAction.Disabled) {
      if (carMake && carModel) {
        setLoanStatus(LoanAction.Idle);
      } else {
        setLoanStatus(LoanAction.Disabled);
      }
    }
  }, [carMake, carModel, LoanAction.Idle, LoanAction.Disabled, loanStatus]);

  return !jwt ? (
    <Row>
      <Col>Please login (see login button at top-right)</Col>
    </Row>
  ) : (
    <Row>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Upload Photo</ModalHeader>
        <ModalBody>
          <p>A good photo can help loan your car!</p>
          <p>
            <Input
              type="file"
              onChange={(e): void => handleFileSelect(e)}
              accept="image/png, image/jpeg"
              id="upload-file"
            />
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={uploadPhoto}
            disabled={!picture?.name}
          >
            Upload Photo
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* <Col sm={2}></Col> */}

      <Col>
        <Row>
          <Col>
            <h3>Loan a car</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <Label for="make">Make</Label>
          </Col>
          <Col sm={10}>
            <Input
              type="text"
              id="make"
              placeholder="e.g. Audi"
              value={carMake}
              onChange={(e): void => setCarMake(e.target.value)}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Label for="model">Model</Label>
          </Col>
          <Col sm={10}>
            <Input
              type="text"
              id="model"
              placeholder="e.g. TT"
              value={carModel}
              onChange={(e): void => setCarModel(e.target.value)}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Button
              color={"primary"}
              size={"lg"}
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

        {loanedCars && loanedCars.length > 0 && (
          <>
            <Row>
              <Col>
                <hr />
              </Col>
            </Row>

            <Row>
              <Col>
                <h3>Your loaned cars</h3>
              </Col>
            </Row>

            <Row>
              <Table striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Date</th>
                    <th>Picture</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {loanedCars.map((car, idx) => (
                    <tr key={car.carId}>
                      <td>{idx}</td>
                      <td>{car.make}</td>
                      <td>{car.model}</td>
                      <td>
                        {new Date(car.createdAt).toLocaleDateString()}{" "}
                        {new Date(car.createdAt).toLocaleTimeString()}
                      </td>
                      <td>
                        <img
                          src={`${car.pictureUrl}?nonce=${car.nonce}`}
                          height={150}
                          alt=""
                        />
                        <FontAwesomeIcon
                          icon={faPencilAlt}
                          size="lg"
                          className="editIcon"
                          color="blue"
                          onClick={(): Promise<void> =>
                            handleEditPhoto(car.carId)
                          }
                        />
                      </td>
                      <td>
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="lg"
                          onClick={(): Promise<void> => handleDelete(car.carId)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
          </>
        )}
      </Col>

      {/* <Col sm={2}></Col> */}
    </Row>
  );
};

Loan.propTypes = {
  jwt: PropTypes.string
};

export default Loan;
