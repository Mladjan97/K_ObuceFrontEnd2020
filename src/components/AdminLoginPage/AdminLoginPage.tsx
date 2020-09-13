import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

export default class AdminLoginPage extends React.Component {
    render() {
        return  (
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={ faSignInAlt } /> Admin Login
                    </Card.Title>
                    <Card.Text>
                        ... the form will be shown here ...
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
        );
    }
}