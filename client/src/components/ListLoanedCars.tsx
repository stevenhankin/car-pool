import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { SyntheticEvent, useEffect, useState, useCallback } from "react";
import { Col, Row, Table } from "reactstrap";
import uuid from "uuid";
import {
  checkIfExists,
  deleteCar,
  getPhotoUploadUrl,
  getUserCars
} from "../api/car-pool-api";
import { Car } from "../types/Car";
import log from "../utils/Log";
import EditCarDetails from "./EditCarDetails";
import UploadCarImage from "./UploadCarImage";

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
  const [editCarModal, setEditCarModal] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | undefined>(undefined);
  const [currentCar, setCurrentCar] = useState<Car | undefined>(undefined);

  /**
   * List of all cars for user
   * @param jwt
   */
  const getCarsForUser = useCallback(
    async (jwt: string): Promise<void> => {
      log.info("Calling API to get loaned cars for user");
      try {
        const response = await getUserCars(jwt);
        const cars = response.data.map(car => ({ ...car, nonce: uuid() }));
        setLoanedCars(cars);
        log.info(`${JSON.stringify(response)}`);
      } catch (e) {
        log.error(JSON.stringify(e));
      }
    },
    [setLoanedCars]
  );

  /**
   * Login will trigger getting list of cars from DynamoDB
   */
  useEffect(() => {
    if (jwt) {
      getCarsForUser(jwt);
    } else {
      setLoanedCars([]);
    }
  }, [getCarsForUser, jwt, setLoanedCars]);

  /**
   * User has clicked icon to edit the photo
   * Get the Signed URL for updating the S3 Bucket
   * and open the Modal to accept a photo payload
   * @param carId
   */
  const handleEditPhoto = async (
    e: SyntheticEvent,
    car: Car
  ): Promise<void> => {
    e.stopPropagation();
    log.info(car.carId);
    if (jwt) {
      try {
        const response = await getPhotoUploadUrl(jwt, car.carId);
        log.info(JSON.stringify(response));
        if (response.status < 299) {
          log.info("success");
          setSignedUrl(response.data.uploadUrl);
          setCurrentCar(car);
          setPhotoModal(true);
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
  const handleDelete = async (
    e: SyntheticEvent,
    carId: string
  ): Promise<void> => {
    e.stopPropagation();
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
   * Shortcut if no loaned cars
   */
  if (loanedCars.length === 0) {
    return <></>;
  }

  /**
   * Bring up the modal for editing the current car
   * @param e
   */
  const handleEditCar = (e: SyntheticEvent, car: Car): void => {
    setCurrentCar(car);
    setEditCarModal(true);
  };

  /**
   * Utility to render a single loaned car
   * @param car
   * @param idx
   */
  const loanedCar = (car: Car, idx: number): React.ReactElement => {
    if (jwt) {
      const imageUrl = `${car.pictureUrl}?nonce=${car.nonce}`;
      checkIfExists(jwt, imageUrl);
      return (
        <tr key={car.carId} onClick={(e): void => handleEditCar(e, car)}>
          <td>{idx + 1}</td>
          <td>{car.make}</td>
          <td>{car.model}</td>
          <td>
            {new Date(car.createdAt).toLocaleDateString()}{" "}
            {new Date(car.createdAt).toLocaleTimeString()}
          </td>
          <td>
            <img src={imageUrl} height={150} alt="" />
            <FontAwesomeIcon
              icon={faPencilAlt}
              size="lg"
              className="editIcon"
              color="blue"
              onClick={(e): Promise<void> => handleEditPhoto(e, car)}
            />
          </td>
          <td>
            <FontAwesomeIcon
              icon={faTrash}
              size="lg"
              onClick={(e): Promise<void> => handleDelete(e, car.carId)}
            />
          </td>
        </tr>
      );
    } else return <></>;
  };

  return (
    <>
      {editCarModal && currentCar && (
        // <></>
        <EditCarDetails
          jwt={jwt}
          loanedCars={loanedCars}
          setLoanedCars={setLoanedCars}
          modal={editCarModal}
          setModal={setEditCarModal}
          currentCar={currentCar}
          getCarsForUser={getCarsForUser}
        />
      )}

      {photoModal && signedUrl && currentCar && (
        <UploadCarImage
          jwt={jwt}
          loanedCars={loanedCars}
          setLoanedCars={setLoanedCars}
          modal={photoModal}
          setModal={setPhotoModal}
          signedUrl={signedUrl}
          currentCarId={currentCar.carId}
          getCarsForUser={getCarsForUser}
        />
      )}

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
          <tbody>{loanedCars.map((car, idx) => loanedCar(car, idx))}</tbody>
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
