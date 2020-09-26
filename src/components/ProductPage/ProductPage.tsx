import React from 'react';
import ApiProductDto from '../../dtos/ApiProductDto';
import api, { ApiResponse } from '../../api/api';
import { Container, Card, Row, Col, Table } from 'react-bootstrap';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faListAlt } from '@fortawesome/free-solid-svg-icons';
import { ApiConfig } from '../../config/api.config';

interface ProductPageProperties {
    match: {
        params: {
            pId: number;
        }
    }
}

interface InStockData{
    quantity: number;
    size: number;
    color: string;
}

interface ProductPageState {
    message: string;
    product?: ApiProductDto;
    inStocks: InStockData[];
}

export default class ProductPage extends React.Component<ProductPageProperties> {
    state: ProductPageState;
    
    constructor(props: Readonly<ProductPageProperties>) {
        super(props);

        this.state = {
            message: '',
            inStocks: [],
        }
    }

    private setMessage(message: string) {
        this.setState(Object.assign(this.state, {
            message: message,
        }));
    }

    private setProductData(productData: ApiProductDto | undefined) {
        this.setState(Object.assign(this.state, {
            product: productData,
        }));
    }

    private setInStockData(inStocks: InStockData[] | undefined) {
        this.setState(Object.assign(this.state, {
            inStocks: inStocks,
        }));
    }

    componentDidMount() {
        this.getProductData();
    }

    componentDidUpdate(oldProperties: ProductPageProperties) {
        if (oldProperties.match.params.pId === this.props.match.params.pId) {
            return;
        }
        this.getProductData();
    }

    getProductData() {
        api('visitor/' + this.props.match.params.pId, 'get', {})
        .then((res: ApiResponse) => {
            if (res.status ==='error'){
            this.setProductData(undefined);
            this.setInStockData(undefined);
            this.setMessage('This product does not exist.')
            return;
            } 

            const data: ApiProductDto = res.data;

            this.setMessage('');
            this.setProductData(data);

            const inStocks1: InStockData[] = [];

            for (const inStocks of data.inStocks) {

                const quantity = inStocks.quantity;
                const size = inStocks.size;
                const color = inStocks.color;
                
                inStocks1.push({ quantity, size, color });


            }
            
            this.setInStockData(inStocks1);
            
        });
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

    render() {
        return (
            <Container>
                <RoledMainMenu role="visitor" />
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faBoxOpen } /> { 
                            this.state.product ?
                            this.state.product?.title :
                            'Product not found'
                            }
                        </Card.Title>
                        { this.printOptionalMessage() }
                        <hr/>
                        <Row>
                            <Col xs="12" lg="8">
                                <div className="description">
                                    { this.state.product?.description }
                                </div>
                                <hr/>
                <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faListAlt } /> In stock:
                        </Card.Title>
                       <Table hover size="sm" bordered>
                        <thead>
                            <tr>
                                <th className="text-center">Quantity</th>
                                <th className="text-center">Size</th>
                                <th className="text-center">Color</th>
                            </tr>
                        </thead>  
                        <tbody>
                            { this.state.inStocks.map(stock => (
                                <tr>
                                    <td className="text-center">{ stock.quantity }</td>
                                    <td className="text-center">{ stock.size }</td>
                                    <td className="text-center">{ stock.color }</td>
                                </tr>
                            ), this) }
                        </tbody> 
                        </Table> 
                    </Card.Body>
                </Card>
                </Container>
                                
                            </Col>
                            <Col xs="12" lg="4">
                               <Row>
                                   <Col xs="12" className="mb-3">
                                       <img alt={ "Image - " + this.state.product?.pictures[0].pictureId } 
                                       src={ ApiConfig.PHOTO_PATH + 'small/' + this.state.product?.pictures[0].imagePath} 
                                       className="w-100" />
                                   </Col>
                               </Row>
                               <Row>
                                   { this.state.product?.pictures.slice(1).map(picture => (
                                       <Col xs="12" sm="6">
                                            <img alt={ "Image - " + picture.pictureId } 
                                                src={ ApiConfig.PHOTO_PATH + 'small/' + picture.imagePath} 
                                                className="w-100 mb-3" />
                                       </Col>
                                   ), this) }
                               </Row>
                               <Row>
                                    <Col xs="12" className="text-center mb-3">
                                        <b>
                                        Price: {
                                        Number(this.state.product?.productPrices[this.state.product?.productPrices.length-1].price).toFixed(2) + ' €'}
                                        </b>
                                    </Col>
                               </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }                        
}
