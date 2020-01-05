import React, { useState, ChangeEvent, MouseEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Col, FormText, Input, Label, Row, Button } from 'reactstrap';
import { createCar } from '../api/car-pool-api';

export interface Props {
    jwt: string|undefined
  }


  /**
   * {user} is the authenticated user's JWT
   */
const Loan: React.FC<Props> = ({ jwt }) => {


    const [make, setMake] = useState<string | undefined>("");
    const [model, setModel] = useState<string | undefined>("");
    const [picture, setPicture] = useState<File | undefined>(undefined);

    /**
     * User has selected a picture to upload
     * @param e 
     */
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const x = e.target.files[0];
            setPicture(x)
        }
    }

    /**
     * User has requested to upload details of car 
     * to loan to marketplace
     * @param e
     */
    const handleLoan = (e: MouseEvent<HTMLButtonElement>) => {
        if (jwt && make && model) {
            createCar(jwt, { make, model });
        }
    }

    return (

        <Row>
            <Col sm={2}></Col>

            <Col>
                <Row>
                    <Col>
                        <Label for="make">Make</Label>
                    </Col>
                    <Col sm={10}>
                        <Input type="text" id="make" placeholder="e.g. Audi" value={make} onChange={(e) => setMake(e.target.value)} />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Label for="model">Model</Label>
                    </Col>
                    <Col sm={10}>
                        <Input type="text" id="model" placeholder="e.g. TT" value={model} onChange={(e) => setModel(e.target.value)} />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Label for="picture" >Picture</Label>
                    </Col>
                    <Col sm={10}>
                        <Input type="file" id="picture" onChange={handleFileSelect} />
                        <FormText color="muted">A picture is worth a thousand words...show people how great your car is!</FormText>
                    </Col>
                </Row>

                <Row>
                    <Button color={"primary"} size={"lg"} onClick={handleLoan} disabled={!make || !model || !picture} >Loan it!</Button>
                </Row>

            </Col>

            <Col sm={2}></Col>

        </Row>

    )
}


export default Loan;