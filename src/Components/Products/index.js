import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Image, List, Typography } from 'antd';
import axios from 'axios';
import { CartContext } from '../CartContext';

function Products() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { cart, addToCart } = useContext(CartContext);

  const fetchData = () => {
    try {
      return axios.get('http://localhost:8000/api/v1/items/').then((response) => setProducts(response.data));
    } catch {
      console.log('Deu pylance');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const logCartContent = setInterval(() => {
      console.log('Cart:', cart);
    }, 1000);

    return () => {
      clearInterval(logCartContent);
    };
  }, [cart]);


  return (
    <div className="productsContainer">
      <List
        loading={loading}
        grid={{ column: 3 }}
        renderItem={(product, index) => {
          return (
            <Card
              className="itemCard"
              title={product.name}
              key={index}
              cover={<Image className="itemCardImage" src={product.profilePicture} />}
              actions={[
                <Button onClick={() => addToCart(product)}>Add to Cart</Button> // Pass the product object to addToCart
              ]}
            >
              <Card.Meta
                title={
                  <Typography.Paragraph>
                    Price: {product.price}€
                  </Typography.Paragraph>
                }
              ></Card.Meta>
            </Card>
          );
        }}
        dataSource={products}
      ></List>
    </div>
  );
}

export default Products;
