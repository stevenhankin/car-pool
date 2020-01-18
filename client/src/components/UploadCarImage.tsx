import PropTypes from "prop-types";
import React, { ChangeEvent, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import log from "../utils/Log";
import { Car } from "../types/Car";
import { putPhoto } from "../api/car-pool-api";
import uuid from "uuid";

export interface Props {
  jwt: string | undefined;
  loanedCars: Car[];
  setLoanedCars: (arg: Car[]) => void;
  modal: boolean;
  setModal: (arg: boolean) => void;
  signedUrl: string;
  currentCarId: string;
  getCarsForUser: (jwt: string) => void;
}

const UploadCarImage: React.FC<Props> = ({
  jwt,
  loanedCars,
  setLoanedCars,
  modal,
  setModal,
  signedUrl,
  currentCarId,
  getCarsForUser
}) => {
  const [picture, setPicture] = useState<File | undefined>(undefined);

  const toggle = (): void => setModal(!modal);

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
        cars.filter(car => car.carId === currentCarId)[0].nonce = uuid();
        setLoanedCars(cars);
        getCarsForUser(jwt);
      }
    }
  };

  return (
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
        <Button color="primary" onClick={uploadPhoto} disabled={!picture?.name}>
          Upload Photo
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

UploadCarImage.propTypes = {
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
  signedUrl: PropTypes.string.isRequired,
  currentCarId: PropTypes.string.isRequired,
  getCarsForUser: PropTypes.func.isRequired
};

export default UploadCarImage;
