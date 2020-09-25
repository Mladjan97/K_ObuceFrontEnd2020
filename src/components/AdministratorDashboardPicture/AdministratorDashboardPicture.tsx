import React from 'react';
import { Container, Card, Row, Col, Button, Form, Nav} from 'react-bootstrap';
import { faImages, faMinus, faPlus, faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse, apiFile } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import PictureType from '../../types/PictureType';
import { ApiConfig } from '../../config/api.config';

interface AdministratorDashboardPictureProperties {
    match: {
        params: {
            pId: number;
        }
    }
}

interface AdministratorDashboardPictureState {
    isAdministratorLoggedIn: boolean;
    pictures: PictureType[];
}

class AdministratorDashboardPicture extends React.Component<AdministratorDashboardPictureProperties> {
    state: AdministratorDashboardPictureState;

    constructor(props: Readonly<AdministratorDashboardPictureProperties>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            pictures: [],

        };
    }

    componentDidMount() {
        this.getPictures();
    }

    componentDidUpdate(oldProps: any) {
        if (this.props.match.params.pId === oldProps.match.params.pId) {
            return;
        }

        this.getPictures();
    }

    private getPictures() {
        api('/api/product/' + this.props.match.params.pId + '/?join=pictures' , 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.setState(Object.assign(this.state, {
                pictures: res.data.pictures,
            }));
        });
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" />
            );
        }

        return (
            <Container>
                <RoledMainMenu role="administrator" />

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faImages } /> Pictures
                        </Card.Title>

                            <Nav className="mb-3">
                                <Nav.Item>
                                    <Link to="/administrator/dashboard/product/" className="btn btn-sm btn-info">
                                        <FontAwesomeIcon icon={ faBackward } /> Go back to products
                                    </Link>
                                </Nav.Item>
                            </Nav>

                        <Row>
                            { this.state.pictures.map(this.printSinlePicture, this) }
                        </Row>

                        <Form className="mt-5">
                            <p>
                                <strong>Add a new picture to this product</strong>
                            </p>
                            <Form.Group>
                                <Form.Label htmlFor="add-picture">New product photo</Form.Label>
                                <Form.File id="add-picture"  />
                                <Form.Group>
                                    <Button className="mt-2" variant="primary"
                                        onClick={ () => this.doUpload() }    >
                                    <FontAwesomeIcon icon={ faPlus } /> Upload picture
                                    </Button>
                                </Form.Group>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private printSinlePicture(picture: PictureType) {
        return (
            <Col xs="12" sm="6" md="4" lg="3">
                <Card>
                    <Card.Body>
                        <img alt={ "Photo" + picture.pictureId } 
                        src= { ApiConfig.PHOTO_PATH + 'small/' + picture.imagePath} 
                        className="w-100"    />
                    </Card.Body>
                    <Card.Footer>
                        { this.state.pictures.length > 1 ? (
                            <Button variant="danger" block
                            onClick={ () => this.deletePicture(picture.pictureId) }>
                                <FontAwesomeIcon icon={ faMinus } /> Delete picture
                            </Button>
                        ): '' }
                    </Card.Footer>
                </Card>
            </Col>
        );
    }

    private async doUpload() {
        const filePicker: any = document.getElementById('add-picture');
        if (filePicker?.files.length === 0) {
             return;  
        }

        const file = filePicker.files[0];
        await this.uploadProductPicture(this.props.match.params.pId, file);
        filePicker.value = '';

        this.getPictures();
    }

    private async uploadProductPicture(productId: number, file: File) {
        return await apiFile('/api/product/' + productId + '/uploadPicture', 'picture', file, 'administrator');
     }

     private deletePicture(pictureId: number) {
        if(!window.confirm('Are you sure?')) {
            return;
        }

         api('/api/product/'+ this.props.match.params.pId + '/deletePicture/' + pictureId + '/', 'delete', {}, 'administrator')
         .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }

            this.getPictures();
         })
     }
}

export default AdministratorDashboardPicture;