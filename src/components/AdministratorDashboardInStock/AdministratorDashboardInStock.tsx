import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Nav } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import InStockType from '../../types/InStockType';
import ApiInStockDto from '../../dtos/ApiInStockDto';

interface AdministratorDashboardInStockState {
    isAdministratorLoggedIn: boolean;
    inStocks: InStockType[];

    addModal: {
        visible: boolean;
        quantity: number;
        size: number;
        color: string;
        productId: number;
        message: string;
    };

    editModal: {
        inStockId?: number;
        visible: boolean;
        quantity: number;
        size: number;
        color: string;
        productId: number;
        message: string;
    };
}

class AdministratorDashboardInStock extends React.Component {
    state: AdministratorDashboardInStockState;

    constructor(props: Readonly <{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            inStocks: [],

            addModal: {
              visible: false,
              quantity: 0,
              size: 0,
              color: '',
              productId: 1,
              message: '',
            },

            editModal: {
                visible: false,
                quantity: 0,
                size: 0,
                color: '',
                productId: 1,
                message: '',
              },
        };
    }

    private setAddModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
                Object.assign(this.state.addModal, {
                visible: newState,
            })
        ));
    }

    private setAddModalStringFieldState(fieldName: string, newValue: string) {
            this.setState(Object.assign(this.state,
                Object.assign(this.state.addModal, {
                [ fieldName ]: newValue,
            })
        ));
    }

    private setAddModalNumberFieldState(fieldName: string, newValue: number) {
        this.setState(Object.assign(this.state,
                Object.assign(this.state.addModal, {
                [ fieldName ]: newValue,
            })
        ));
    }

    private setEditModalVisibleState(newState: boolean) {
        this.setState(Object.assign(this.state,
                Object.assign(this.state.editModal, {
                visible: newState,
            })
        ));
    }

    private setEditModalStringFieldState(fieldName: string, newValue: string) {
            this.setState(Object.assign(this.state,
                Object.assign(this.state.editModal, {
                [ fieldName ]: newValue,
            })
        ));
    }

    private setEditModalNumberFieldState(fieldName: string, newValue: number) {
        this.setState(Object.assign(this.state,
                Object.assign(this.state.editModal, {
                [ fieldName ]: newValue,
            })
        ));
    }

    componentDidMount() {
        this.getInStock();
    }

    private getInStock() {
        api('api/inStock/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            this.putInStockInState(res.data);
        });
    }

    private putInStockInState(data: ApiInStockDto[]) {
        const inStocks: InStockType[] = data.map(inStock => {
         return {
            inStockId: inStock.inStockId,
            quantity: inStock.quantity,
            size: inStock.size,
            color: inStock.color,
            productId: inStock.productId,
         };
        });
   
        const newState = Object.assign(this.state, {
            inStocks: inStocks,
        });
   
        this.setState(newState);
      }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        }));
    }

    render() {
        if(this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to ="/administrator/login" />
            );
        }

        return (
            <Container>
                <RoledMainMenu role="administrator" />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faListAlt } /> In stock
                        </Card.Title>
                        <Nav className="mb-3">
                                <Nav.Item>
                                    <Link to="/administrator/dashboard/" className="btn btn-sm btn-info">
                                        <FontAwesomeIcon icon={ faBackward } /> Go back to dashboard
                                    </Link>
                                </Nav.Item>
                            </Nav>
                       <Table hover size="sm" bordered>
                        <thead>
                            <tr>
                                <th colSpan={ 5 }></th>
                                <th className="text-center">
                                    <Button variant="primary" size="sm"
                                        onClick={ () => this.showAddModal() }>
                                        <FontAwesomeIcon icon= { faPlus } /> Add
                                    </Button>
                                </th>
                            </tr>
                            <tr>
                                <th className="text-right">ID</th>
                                <th>Quantity</th>
                                <th>Size</th>
                                <th>Color</th>
                                <th>Product ID</th>
                                <th></th>
                            </tr>
                        </thead>  
                        <tbody>
                            { this.state.inStocks.map(inStock => (
                                <tr>
                                    <td className="text-right">{ inStock.inStockId }</td>
                                    <td>{ inStock.quantity }</td>
                                    <td>{ inStock.size }</td>
                                    <td>{ inStock.color }</td>
                                    <td>{ inStock.productId }</td>
                                    <td className="text-center">
                                    <Button variant="info" size="sm"
                                        onClick={ () => this.showEditModal(inStock) }>
                                        <FontAwesomeIcon icon= { faEdit } /> Edit
                                    </Button>
                                    </td>
                                </tr>
                            ), this) }
                        </tbody> 
                        </Table> 
                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={ this.state.addModal.visible } onHide={ () => this.setAddModalVisibleState(false) } >
                    <Modal.Header closeButton>
                        <Modal.Title>Add new Stock</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="quantity">Quantity</Form.Label>
                            <Form.Control id="quantity" type="number" value={this.state.addModal.quantity}
                                onChange={ (e) => this.setAddModalNumberFieldState('quantity', Number(e.target.value)) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="size">Size</Form.Label>
                            <Form.Control id="size" type="number" value={this.state.addModal.size}
                                onChange={ (e) => this.setAddModalNumberFieldState('size', Number(e.target.value)) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="color">Color</Form.Label>
                            <Form.Control id="color" type="string" value={this.state.addModal.color}
                                onChange={ (e) => this.setAddModalStringFieldState('color', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="productId">Product ID</Form.Label>
                            <Form.Control id="productId" type="number" value={this.state.addModal.productId}
                                onChange={ (e) => this.setAddModalNumberFieldState('productId', Number(e.target.value)) } />
                        </Form.Group>
                           <Form.Group>
                               <Button variant="primary" onClick={ () => this.doAddInStock() }>
                               <FontAwesomeIcon icon= { faPlus } /> Add new Stock
                               </Button>
                           </Form.Group>
                           { this.state.addModal.message ? (
                               <Alert variant="danger" value={ this.state.addModal.message } />
                           ) : '' }
                    </Modal.Body>
                </Modal>

                <Modal size="lg" centered show={ this.state.editModal.visible } onHide={ () => this.setEditModalVisibleState(false) } >
                    <Modal.Header closeButton>
                        <Modal.Title>Edit inStock</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="quantity">Quantity</Form.Label>
                            <Form.Control id="quantity" type="number" value={this.state.editModal.quantity}
                                onChange={ (e) => this.setEditModalNumberFieldState('quantity', Number(e.target.value)) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="size">Size</Form.Label>
                            <Form.Control id="size" type="number" value={this.state.editModal.size}
                                onChange={ (e) => this.setEditModalNumberFieldState('size', Number(e.target.value)) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="color">Color</Form.Label>
                            <Form.Control id="color" type="text" value={this.state.editModal.color}
                                onChange={ (e) => this.setEditModalStringFieldState('color', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="productId">Product ID</Form.Label>
                            <Form.Control id="productId" type="number" value={this.state.editModal.productId}
                                onChange={ (e) => this.setEditModalNumberFieldState('productId', Number(e.target.value)) } />
                        </Form.Group>
                           <Form.Group>
                               <Button variant="primary" onClick={ () => this.doEditInStock() }>
                               <FontAwesomeIcon icon= { faEdit } /> Edit Stock
                               </Button>
                           </Form.Group>
                           { this.state.addModal.message ? (
                               <Alert variant="danger" value={ this.state.editModal.message } />
                           ) : '' }
                    </Modal.Body>
                </Modal>
            </Container>
        );
    }

    private showAddModal() {
        this.setAddModalStringFieldState('quantity', '0');
        this.setAddModalStringFieldState('size', '0');
        this.setAddModalStringFieldState('color', '');
        this.setAddModalStringFieldState('productId', '1');
        this.setAddModalStringFieldState('message', '');
        this.setAddModalVisibleState(true);
    }

    private doAddInStock() {
        api('/api/inStock/', 'post', {
            quantity: this.state.addModal.quantity,
            size: this.state.addModal.size,
            color: this.state.addModal.color,
            productId: this.state.addModal.productId,
        }, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                this.setLogginState(false);
                return;
            }
            if(res.status === "error") {
                this.setAddModalStringFieldState('Message', JSON.stringify(res.data));
                return;
            }

            this.setAddModalVisibleState(false);
            this.getInStock();
        });
    }

    private showEditModal(inStock: InStockType) {
        this.setEditModalNumberFieldState('quantity', Number(inStock.quantity));
        this.setEditModalNumberFieldState('size', Number(inStock.size));
        this.setEditModalStringFieldState('color', String(inStock.color));
        this.setEditModalNumberFieldState('productId', Number(inStock.productId));
        this.setEditModalNumberFieldState('inStockId', Number(inStock.inStockId));
        this.setEditModalStringFieldState('message', '');
        this.setEditModalVisibleState(true);
    }

    private doEditInStock() {
        api('/api/inStock/' + this.state.editModal.inStockId, 'patch', {
            quantity: this.state.editModal.quantity,
            size: this.state.editModal.size,
            color: this.state.editModal.color,
            productId: this.state.editModal.productId,
        }, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === 'login') {
                this.setLogginState(false);
                return;
            }
            if(res.status === "error") {
                this.setEditModalStringFieldState('Message', JSON.stringify(res.data));
                return;
            }

            this.setEditModalVisibleState(false);
            this.getInStock();
        });
    }
}

export default AdministratorDashboardInStock;