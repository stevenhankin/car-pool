import React, { useState, ChangeEvent, useEffect } from 'react';
// import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Col, Input, Label, Row, Button } from 'reactstrap';
import { createCar, getUserCars } from '../api/car-pool-api';
import { Spinner } from 'reactstrap';
// import { LogIn } from './LogIn';
import log from '../utils/Log';
import PropTypes from 'prop-types';
import { Car } from '../types/Car';

export interface Props {
  jwt: string | undefined;
}

/**
 * {user} is the authenticated user's JWT
 */
const Loan: React.FC<Props> = ({ jwt }) => {
  // State of the Loan button:  Disabled <-> Idle -> Loaning -> Success|Failed
  enum LoanAction {
    Disabled = 'Enter fields above',
    Idle = 'Loan it!',
    Loaning = 'Loaning... ',
    Failed = 'Failed 🆇',
    Success = 'Completed'
  }

  const [make, setMake] = useState<string | undefined>('');
  const [model, setModel] = useState<string | undefined>('');
  const [picture, setPicture] = useState<File | undefined>(undefined);
  const [loanStatus, setLoanStatus] = useState<LoanAction>(LoanAction.Disabled);
  const [loanedCars, setLoanedCars] = useState<Car[]>([]);

  const getCarsForUser = async (jwt: string): Promise<void> => {
    log.info('Calling API to get loaned cars for user');
    try {
      const response = await getUserCars(jwt);
      setLoanedCars(response.data);
      log.info(`${JSON.stringify(response)}`);
    } catch (e) {
      log.error(JSON.stringify(e));
    }
  };

  useEffect(() => {
    if (jwt) {
      getCarsForUser(jwt);
    }
  }, []);

  /**
   * User has selected a picture to upload
   * @param e
   */
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const picture = e.target.files[0];
      log.debug(`selected file ${JSON.stringify(picture)}`);
      setPicture(picture);
    } else {
      log.error('No file selected');
    }
  };

  /**
   * User has requested to upload details of car
   * to loan to marketplace
   * @param e
   */
  const handleLoan = async (): Promise<void> => {
    if (loanStatus === LoanAction.Idle) {
      if (jwt && make && model) {
        setLoanStatus(LoanAction.Loaning);
        try {
          const car = await createCar(jwt, { make, model });
          log.info(`created car for loaning ${JSON.stringify(car)}`);
          setLoanStatus(LoanAction.Success);
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

  useEffect(() => {
    if (loanStatus === LoanAction.Idle || LoanAction.Disabled) {
      if (make && model) {
        setLoanStatus(LoanAction.Idle);
      } else {
        setLoanStatus(LoanAction.Disabled);
      }
    }
  }, [make, model]);

  return (
    <Row>
      <Col sm={2}></Col>

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
              value={make}
              onChange={(e): void => setMake(e.target.value)}
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
              value={model}
              onChange={(e): void => setModel(e.target.value)}
            />
          </Col>
        </Row>

        {/* <Row>
                    <Col>
                        <Label for="picture" >Picture</Label>
                    </Col>
                    <Col sm={10}>
                        <Input type="file" id="picture" onChange={handleFileSelect} />
                        <FormText color="muted">A picture is worth a thousand words...show people how great your car is!</FormText>
                    </Col>
                </Row> */}

        <Row>
          <Col>
            <Button
              color={'primary'}
              size={'lg'}
              onClick={handleLoan}
              disabled={!make || !model}
            >
              {loanStatus}{' '}
              {loanStatus === LoanAction.Loaning && (
                <Spinner style={{ height: '1.5rem', width: '1.5rem' }} />
              )}
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <h3>Your loaned cars</h3>
          </Col>
        </Row>
        {loanedCars.map(car => (
          <Row key={car.carId}>
            <Col>{JSON.stringify(car)}</Col>
          </Row>
        ))}
      </Col>

      <Col sm={2}></Col>
    </Row>
  );
};

Loan.propTypes = {
  jwt: PropTypes.string
};

export default Loan;
