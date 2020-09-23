import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faHeadset, faMobileAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

export default class ContactPage extends React.Component {
    render() {
        return  (
        <Container>
            <RoledMainMenu role="visitor" />
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faPhone } /> Contact details
                    </Card.Title>

                    <Card.Text>
                            <FontAwesomeIcon icon={ faMobileAlt } /> Mobile number: +381 1238124879
                    </Card.Text>
                    <Card.Text>
                            <FontAwesomeIcon icon={ faHeadset } /> Technical support: +381 287915897
                    </Card.Text>
                    <Card.Text>
                            <FontAwesomeIcon icon={ faEnvelope } /> Email: TechnicalSupport@support.rs
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
        );
    }
}