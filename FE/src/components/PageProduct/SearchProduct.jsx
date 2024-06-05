// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../PageProduct/ProductList.css';
import '../PageProduct/SearchProduct.css';
import { getAllProduct} from '../../api/apiService';
import { DropdownButton, Dropdown, Form, CardBody, Card, Row, Tab, ListGroup, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const SearchProduct = () => {
  const [productList, setProductList] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [sortedProductList, setSortedProductList] = useState([]);

  useEffect(() => {
    // Fetch default products when component mounts
    fetchDefaultProducts();
  }, []);

  useEffect(() => {
    if (categoryName) {
      fetchProducts();
    }
  }, [categoryName]);

  useEffect(() => {
    const sortedList = [...productList];
    sortedList.sort((a, b) => a.price - b.price);
    setSortedProductList(sortedList);
  }, [productList]);

  const fetchDefaultProducts = async () => {
    try {
      // You can modify this part to fetch default products from API
      // For example:
      const defaultProducts = await getAllProduct({ category: 'Dog Food' });
      setProductList(defaultProducts);
    } catch (error) {
      console.error("Error fetching default products:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getAllProduct({ category: categoryName });
      setProductList(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setCategoryName(category);
  };

  const sortAscending = () => {
    const sortedList = [...sortedProductList];
    sortedList.sort((a, b) => a.price - b.price);
    setSortedProductList(sortedList);
  };

  const sortDescending = () => {
    const sortedList = [...sortedProductList];
    sortedList.sort((a, b) => b.price - a.price);
    setSortedProductList(sortedList);
  };


  return (
    <>
      <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link0">
        <div className='header-menu'>
          <Row>
            <Col sm={4}>
              <ListGroup>
                <ListGroup.Item
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                  action
                  onClick={() => handleCategoryClick('Dog Food')}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">Dog Food</div>
                  </div>
                  
                </ListGroup.Item>

                {['Cat Food', 'Balo', 'Toy', 'Cake'].map((item, index) => (
                  <ListGroup.Item
                    key={index}
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    action
                    onClick={() => handleCategoryClick(item)}
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{item}</div>
                    </div>
                    
                  </ListGroup.Item>
                ))}
              </ListGroup>
              

              <Form.Label>Range</Form.Label>
              <Form.Range />
            </Col>

            <Col sm={8}>
              <div className='sort'>
                <Row>
                  <Col xs={6} md={4}>
                    <span>Sort: </span>
                    <DropdownButton id="dropdown-basic-button" title="Dropdown button" >
                      <Dropdown.Item onClick={sortDescending}>HighToLow</Dropdown.Item>
                      <Dropdown.Item onClick={sortAscending}>LowToHigh</Dropdown.Item>
                    </DropdownButton>
                  </Col>
                </Row>
              </div>

              <Row xs={1} md={2} className="g-4">
                {sortedProductList.map((product, index) => (
                  <Card key={index}>
                    <Card.Img variant="top" src={product.picture} />
                    <CardBody>
                      <Card.Title>{product.productName}</Card.Title>
                      <Card.Text>${product.price}</Card.Text>
                      <Link to={`/productdisplay/${product.productName}`}>View Details</Link>
                    </CardBody>
                  </Card>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </Tab.Container>
    </>
  )
}

export default SearchProduct;
