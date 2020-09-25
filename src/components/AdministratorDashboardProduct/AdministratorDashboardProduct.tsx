import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Nav } from 'react-bootstrap';
import { faListAlt, faPlus, faEdit, faSave, faImages, faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect, Link } from 'react-router-dom';
import api, { ApiResponse, apiFile } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ProductType from '../../types/ProductType';
import ApiProductDto from '../../dtos/ApiProductDto';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';
import MaterialType from '../../types/MaterialType';
import ApiMaterialDto from '../../dtos/ApiMaterialDto';

interface AdministratorDashboardProductState {
    isAdministratorLoggedIn: boolean;
    products: ProductType[];
    categories: CategoryType[];
    materials: MaterialType[];

    addModal: {
        visible: boolean;
        message: string;
        title: string;
        description: string;
        categoryId: number;
        productMaterialId: number;
        price: number;

    };

    editModal: {
        productId?: number;
        message: string;
        visible: boolean;
        title: string;
        description: string;
        categoryId: number;
        productMaterialId: number;
        price: number;
    };
}

class AdministratorDashboardProduct extends React.Component {
    state: AdministratorDashboardProductState;

    constructor(props: Readonly <{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            products: [],
            categories: [],
            materials: [],

            addModal: {
              visible: false,
              title: '',
              message: '',
              description: '',
              categoryId: 1,
              productMaterialId: 1,
              price: 0.01,
            },

            editModal: {
                visible: false,
                title: '',
                message: '',
                description: '',
                categoryId: 1,
                productMaterialId: 1,
                price: 0.01,
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
        this.getMaterials();
        this.getCategories();
        this.getProduct();
    }

    private getCategories() {
        api('api/category/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            this.putCategoriesInState(res.data);
        });
    }

    private putCategoriesInState(data: ApiCategoryDto[]) {
        const categories: CategoryType[] = data.map(category => {
         return {
           categoryId: category.categoryId,
           name: category.name,
           imagePath: category.imagePath,
         };
        });
   
        this.setState(Object.assign(this.state, {
            categories: categories,
          }));
      }

      private getMaterials() {
        api('api/material/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            this.putMaterialInState(res.data);
        });
    }

    private putMaterialInState(data: ApiMaterialDto[]) {
        const materials: MaterialType[] = data.map(material => {
         return {
            productMaterialId: material.productMaterialId,
            materialName: material.materialName,
         };
        });
   
        this.setState(Object.assign(this.state, {
            materials: materials,
          }));
      }

    private getProduct() {
        api('api/product/?join=pictures&join=productPrices&join=category&join=productMaterial', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            this.putProductInState(res.data);
        });
    }

    private putProductInState(data: ApiProductDto[]) {
        const products: ProductType[] = data.map(product => {
         return {
           productId: product.productId,
           title: product.title,
           description: product.description,
           imageUrl: product.pictures[0].imagePath,
           price: product.productPrices[product.productPrices.length-1].price,
           
           productPrices: product.productPrices,
           pictures: product.pictures,
           category: product.category,
           productMaterial: product.productMaterial,
         };
        });
   
        const newState = Object.assign(this.state, {
          products: products,
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
                            <FontAwesomeIcon icon={ faListAlt } /> Products
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
                                <th colSpan={ 6 }></th>
                                <th className="text-center">
                                    <Button variant="primary" size="sm"
                                        onClick={ () => this.showAddModal() }>
                                        <FontAwesomeIcon icon= { faPlus } /> Add
                                    </Button>
                                </th>
                            </tr>
                            <tr>
                                <th className="text-right">ID</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Material</th>
                                <th>Description</th>
                                <th className="text-right">Price</th>
                                <th></th>
                            </tr>
                        </thead>  
                        <tbody>
                            { this.state.products.map(product => (
                                <tr>
                                    <td className="text-right">{ product.productId }</td>
                                    <td>{ product.title }</td>
                                    <td>{ product.category?.name }</td>
                                    <td>{ product.productMaterial?.materialName }</td>
                                    <td>{ product.description }</td>
                                    <td className="text-right">{ product.price }</td>
                                    <td className="text-center">
                                        <Link to={"/administrator/dashboard/picture/" + product.productId }
                                        className="btn btn-sm btn-info mb-3">
                                            <FontAwesomeIcon icon={ faImages } /> Pictures
                                        </Link>
                                    <Button variant="info" size="sm"
                                        onClick={ () => this.showEditModal(product) }>
                                        <FontAwesomeIcon icon= { faEdit } /> Edit
                                    </Button>
                                    </td>
                                </tr>
                            ), this) }
                        </tbody> 
                        </Table> 
                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={ this.state.addModal.visible } 
                        onHide={ () => this.setAddModalVisibleState(false) }
                        onEntered={ () => {
                           if (document.getElementById('add-picture')) {
                            const filePicker: any = document.getElementById('add-picture');
                            filePicker.value = '';
                            } 
                        } }>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="add-title">Title</Form.Label>
                            <Form.Control id="add-title" type="text" value={this.state.addModal.title}
                                onChange={ (e) => this.setAddModalStringFieldState('title', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-description">Detailed text</Form.Label>
                            <Form.Control id="add-description" as="textarea" value={this.state.addModal.description}
                                onChange={ (e) => this.setAddModalStringFieldState('description', e.target.value) } 
                                rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-categoryId">Category</Form.Label>
                            <Form.Control id="add-categoryId" as="select" value={this.state.addModal.categoryId.toString() }
                                onChange={ (e) => this.setAddModalNumberFieldState('categoryId', Number(e.target.value)) } >
                                    { this.state.categories.map(category => (
                                        <option value={ category.categoryId?.toString() }>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-productMaterialId">Material</Form.Label>
                            <Form.Control id="add-productMaterialId" as="select" value={this.state.addModal.productMaterialId.toString() }
                                onChange={ (e) => this.setAddModalNumberFieldState('productMaterialId', Number(e.target.value)) } >
                                    { this.state.materials.map(material => (
                                        <option value={ material.productMaterialId?.toString() }>
                                            {material.materialName}
                                        </option>
                                    ))}
                                </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-price">Price</Form.Label>
                            <Form.Control id="add-price" type="number" min={ 0.01 } step={ 0.01 } value={this.state.addModal.price}
                                onChange={ (e) => this.setAddModalNumberFieldState('price', Number(e.target.value)) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="add-picture">Product photo</Form.Label>
                            <Form.File id="add-picture"  />
                        </Form.Group>
                           <Form.Group>
                               <Button variant="primary" onClick={ () => this.doAddProduct() }>
                               <FontAwesomeIcon icon= { faPlus } /> Add new product
                               </Button>
                           </Form.Group>
                           { this.state.addModal.message ? (
                               <Alert variant="danger" value={ this.state.addModal.message } />
                           ) : '' }
                    </Modal.Body>
                </Modal>

                <Modal size="lg" centered show={ this.state.editModal.visible } 
                        onHide={ () => this.setEditModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="edit-title">Title</Form.Label>
                            <Form.Control id="edit-title" type="text" value={this.state.editModal.title}
                                onChange={ (e) => this.setEditModalStringFieldState('title', e.target.value) } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-description">Detailed text</Form.Label>
                            <Form.Control id="edit-description" as="textarea" value={this.state.editModal.description}
                                onChange={ (e) => this.setEditModalStringFieldState('description', e.target.value) } 
                                rows={ 10 } />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="edit-price">Price</Form.Label>
                            <Form.Control id="edit-price" type="number" min={ 0.01 } step={ 0.01 } value={this.state.editModal.price}
                                onChange={ (e) => this.setEditModalNumberFieldState('price', Number(e.target.value)) } />
                        </Form.Group>
                           <Form.Group>
                               <Button variant="primary" onClick={ () => this.doEditProduct() }>
                               <FontAwesomeIcon icon= { faSave } /> Edit product
                               </Button>
                           </Form.Group>
                           { this.state.editModal.message ? (
                               <Alert variant="danger" value={ this.state.editModal.message } />
                           ) : '' }
                    </Modal.Body>
                </Modal>

            </Container>
        );
    }

    private showAddModal() {
        this.setAddModalStringFieldState('title', '');
        this.setAddModalStringFieldState('categoryId', '1');
        this.setAddModalStringFieldState('productMaterialId', '1');
        this.setAddModalStringFieldState('description', '');
        this.setAddModalStringFieldState('price', '0.01');
        this.setAddModalStringFieldState('message', '');
        this.setAddModalVisibleState(true);
    }

    private doAddProduct() {
        const filePicker: any = document.getElementById('add-picture');
        if (filePicker?.files.length === 0) {
            this.setAddModalStringFieldState('message', 'You must select a file to upload!');
            return;  
        }

        api('/api/product/', 'post', {
            title: this.state.addModal.title,
            categoryId: this.state.addModal.categoryId,
            productMaterialId: this.state.addModal.productMaterialId,
            description: this.state.addModal.description,
            price: this.state.addModal.price,
        }, 'administrator')
        .then(async(res: ApiResponse) => {
            if (res.status === 'login') {
                this.setLogginState(false);
                return;
            }
            if(res.status === "error") {
                this.setAddModalStringFieldState('message', JSON.stringify(res.data));
                return;
            }

            const productId: number = res.data.productId;

            const file = filePicker.files[0];
            const resp = await this.uploadProductPicture(productId, file);

            if (resp.status !== 'ok') {
                this.setAddModalStringFieldState('message', 'Could not upload this file. Try again!');
            }

            this.setAddModalVisibleState(false);
            this.getProduct();
        });
    }

    private async uploadProductPicture(productId: number, file: File) {
       return await apiFile('/api/product/' + productId + '/uploadPicture', 'picture', file, 'administrator');
    }

    private showEditModal(product: ProductType) {
        this.setEditModalStringFieldState('title', String(product.title));
        this.setEditModalNumberFieldState('productId', Number(product.productId));
        this.setEditModalStringFieldState('message', '');
        this.setEditModalStringFieldState('description', String(product.description));
        this.setEditModalNumberFieldState('price', Number(product.price));
        this.setEditModalVisibleState(true);
    }

    private doEditProduct() {
        api('/api/product/' + this.state.editModal.productId, 'patch', {
            title: this.state.editModal.title,
            description: this.state.editModal.description,
            price: this.state.editModal.price,
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
            this.getProduct();
        });
    }
}

export default AdministratorDashboardProduct;