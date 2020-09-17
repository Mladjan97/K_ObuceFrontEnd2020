import React from 'react';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import CategoryType from '../../types/CategoryType';
import api, { ApiResponse } from '../../api/api';
import ProductType from '../../types/ProductType';
import { Link } from 'react-router-dom';
import { ApiConfig } from '../../config/api.config';

interface CategoryPageProperties {
    match: {
        params: {
            cId: number;
        }
    }
}

interface CategoryPageState {
    category?: CategoryType;
    products?: ProductType[];
    message: string;
    filters: {
        // categoryName: string;
        // materialName: string;
        // size: number;
        // color: string;
        keywords: string;
        priceMinimum: number;
        priceMaximum: number;
        order: "title asc" | "title desc" | "price asc" | "price desc";
    };
}

interface ProductDto {
    productId: number;
    title: string;
    description: string;
    productPrices?: {
        price: number;
        createdAt: string;
    }[],
    pictures?: {
        imagePath: string;
    }[],

}

export default class CategoryPage extends React.Component<CategoryPageProperties> {
    state: CategoryPageState;

    constructor(props: Readonly<CategoryPageProperties>) {
        super(props);

        this.state = { 
            message: '',
            filters: {
                keywords: '',
                priceMinimum: 1,
                priceMaximum: 10000,
                order: "price asc",
            }
        };
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setCategoryData(category: CategoryType) {
        this.setState(Object.assign(this.state, {
            category: category,
        }));
    }

    private setProducts(products: ProductType[]) {
        this.setState(Object.assign(this.state, {
            products: products,
        }));
    }



    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faListAlt } /> { this.state.category?.name }
                        </Card.Title>
                        { this.printOptionalMessage() }
                        
                        <Row>
                            <Col xs="12" md="4" lg="3">
                               { this.printFilters() }
                            </Col>
                            <Col xs="12" md="8" lg="9">
                            { this.showProducts() }
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private setNewFilter(newFilter: any) {
        this.setState(Object.assign(this.state, {
            filter: newFilter,
        }));
    }

    private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>) {
            this.setNewFilter(Object.assign(this.state.filters, {
                keywords: event.target.value,
            }));
    }

    private filterPriceMinChanged(event: React.ChangeEvent<HTMLInputElement>) {
            this.setNewFilter(Object.assign(this.state.filters, {
                priceMinimum: Number(event.target.value),
            }));
    }

    private filterPriceMaxChanged(event: React.ChangeEvent<HTMLInputElement>) {
            this.setNewFilter(Object.assign(this.state.filters, {
                priceMaximum: Number(event.target.value),
            }));
    }

    private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>) {
            this.setNewFilter(Object.assign(this.state.filters, {
                order: event.target.value,
            }));
    }

    private applyFilters() {
        this.getCategoryData();
    }

    private printFilters(){
        return(
            <>
                <Form.Group>
                    <Form.Label htmlFor="keywords">Search keywords:</Form.Label>
                    <Form.Control type="text" id="keywords"
                                   value={ this.state.filters.keywords }
                                   onChange={ (e) => this.filterKeywordsChanged(e as any) }
                                   />
                </Form.Group>

                <Form.Group>
                    <Row>
                        <Col xs ="12" sm="6">
                        <Form.Label htmlFor="priceMin">Min. price:</Form.Label>
                            <Form.Control type="number" id="priceMin"
                                          step="0.01" min="0.01" max="9999.99" 
                                          value={ this.state.filters.priceMinimum } 
                                          onChange={ (e) => this.filterPriceMinChanged(e as any) } />
                        </Col>
                        <Col xs ="12" sm="6">
                        <Form.Label htmlFor="priceMax">Max. price:</Form.Label>
                            <Form.Control type="number" id="priceMax"
                                          step="0.01" min="0.02" max="10000" 
                                          value={ this.state.filters.priceMaximum } 
                                          onChange={ (e) => this.filterPriceMaxChanged(e as any) } />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group>
                    <Form.Control as="select" id="sortOrder" value ={ this.state.filters.order }
                                                             onChange={ (e) => this.filterOrderChanged(e as any) }>
                        <option value="title asc">Sort by name - ascendig</option>
                        <option value="title desc">Sort by name - descending</option>
                        <option value="price asc">Sort by price - ascendig</option>
                        <option value="price desc">Sort by price - descending</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" block onClick={ () => this.applyFilters() }>
                        <FontAwesomeIcon icon= { faSearch } /> Search
                    </Button>
                </Form.Group>
            </>
        );
    }

    private printOptionalMessage() {
        if(this.state.message === '' ) {
            return;
        }
        return (
                <Card.Text>
                    { this.state.message }
                </Card.Text>
        );
    }

    private showProducts() {
        if (this.state.products?.length === 0) {
            return(
                <div>There are no products to show in this category.</div>
            );
        }
        return (
            <Row>
                { this.state.products?.map(this.singleProduct) }
            </Row>
        );
    }

    private singleProduct(product: ProductType) {
        return(
          <Col lg="4" md="6" sm="6" xs="12">
            <Card className="mb-3">
                <Card.Header>
                    <img alt={ product.title }
                         src={ ApiConfig.PHOTO_PATH + 'small/' + product.imageUrl }
                         className="w-100"
                          />
                </Card.Header>
              <Card.Body>
              <Card.Title as="p">
                  <strong>
                { product.title }
                </strong>
              </Card.Title>
              <Card.Text>
                  Price: { Number(product.price).toFixed(2) } EUR
              </Card.Text>
                <Link to={ `/product/${ product.productId }` }
                className="btn btn-primary btn-block btn-sm">
                  Open product page
                </Link>
              </Card.Body>
            </Card>
          </Col>
        );
      }

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(oldProperties: CategoryPageProperties) {
        if (oldProperties.match.params.cId === this.props.match.params.cId) {
            return;
        }
        this.getCategoryData();
    }

    private getCategoryData() {
        api('api/category/' + this.props.match.params.cId, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status ==='error'){
                return this.setMessage('Request error. Please try to refresh the page.')
            }

            const categoryData: CategoryType = {
                categoryId: res.data.categoryId,
                name: res.data.name,
            };

            this.setCategoryData(categoryData);
        });

        const orderParts = this.state.filters.order.split(' ');
        const orderBy = orderParts[0];
        const orderDirection = orderParts[1].toUpperCase();

        api('api/product/search/', 'post', {
            categoryId: Number(this.props.match.params.cId),
            // size: 43,
            color: "",
            keywords: this.state.filters.keywords,
            priceMin: this.state.filters.priceMinimum,
            priceMax: this.state.filters.priceMaximum,
            orderBy: orderBy,
            orderDirection: orderDirection,

        })
        .then((res: ApiResponse) => {
            if (res.status ==='error'){
                return this.setMessage('Request error. Please try to refresh the page.');
            }

            if(res.data.statusCode === 0) {
                 this.setMessage('');
                 this.setProducts([]);
                 return;
            }

           const products: ProductType[] =
           res.data.map((product: ProductDto ) => {
            const object: ProductType = {
            productId: product.productId,
            title: product.title,
            description: product.description,
            imageUrl: '',
            price: 0,
            };

            if (product.pictures !== undefined && product.pictures?.length > 0) {
                object.imageUrl = product.pictures[product.pictures?.length-1].imagePath;
            }

            if (product.productPrices !== undefined && product.productPrices?.length > 0) {
                object.price = product.productPrices[product.productPrices?.length-1].price;
            }

            return object;
           });

           this.setProducts(products);
        });
    }
}