import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
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

                        { this.showProducts() }
                    </Card.Body>
                </Card>
            </Container>
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

        api('api/product/search/', 'post', {
            categoryId: Number(this.props.match.params.cId),
            // size: 43,
            color: "",
            keywords: "",
            priceMin: 0.01,
            priceMax: 10000,
            orderBy: "price",
            orderDirection: "ASC"

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