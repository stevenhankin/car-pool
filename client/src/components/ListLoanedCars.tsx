import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { ChangeEvent, useState, useEffect } from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table
} from "reactstrap";
import uuid from "uuid";
import {
  deleteCar,
  getPhotoUploadUrl,
  putPhoto,
  getUserCars
} from "../api/car-pool-api";
import { Car } from "../types/Car";
import log from "../utils/Log";

export interface Props {
  jwt: string | undefined;
  loanedCars: Car[];
  setLoanedCars: (arg: Car[]) => void;
}

/**
 * {user} is the authenticated user's JWT
 */
const ListLoanedCars: React.FC<Props> = ({
  jwt,
  loanedCars,
  setLoanedCars
}) => {
  const [modal, setModal] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | undefined>(undefined);
  const [editCarId, setEditCarId] = useState<string | undefined>(undefined);
  const [picture, setPicture] = useState<File | undefined>(undefined);

  const toggle = (): void => setModal(!modal);

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

  if (loanedCars.length === 0) {
    return <></>;
  }

  return (
    <>
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
                    onClick={(): Promise<void> => handleEditPhoto(car.carId)}
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
  );
};

ListLoanedCars.propTypes = {
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

export default ListLoanedCars;
